"use client";

import CodeMirror from "@uiw/react-codemirror";
import { python } from "@codemirror/lang-python";
import { oneDark } from "@codemirror/theme-one-dark";
import {
  BookOpen,
  Check,
  ChevronRight,
  CircleCheck,
  Clock3,
  ExternalLink,
  FileCode2,
  Play,
  RotateCcw,
  Send,
  Terminal,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { questions } from "./questions";

type WorkerResponse = { id: number; output: string; error: string };
type ExecutionResult = { output: string; error: string };
type MarkResult = {
  score: number;
  total: number;
  criteria: { title: string; earned: number; marks: number; passed: number; checks: number }[];
};

const sectionLabels = {
  short: "Short drills",
  exam: "Exam papers",
  mock: "Mock paper",
};

export function PracticeIde() {
  const [section, setSection] = useState<keyof typeof sectionLabels>("exam");
  const [selectedId, setSelectedId] = useState("exam-2025-a");
  const [codeById, setCodeById] = useState<Record<string, string>>({});
  const [output, setOutput] = useState("Run your code to see its output here.");
  const [stdin, setStdin] = useState("");
  const [panel, setPanel] = useState<"console" | "marking">("console");
  const [running, setRunning] = useState(false);
  const [marking, setMarking] = useState(false);
  const [markResults, setMarkResults] = useState<Record<string, MarkResult>>({});
  const [elapsed, setElapsed] = useState(0);
  const workerRef = useRef<Worker | null>(null);
  const runtimeReady = useRef(false);
  const jobRef = useRef(0);

  const selected = questions.find((question) => question.id === selectedId) ?? questions[0];
  const code = codeById[selected.id] ?? selected.starter;
  const visibleQuestions = questions.filter((question) => question.section === section);
  const markResult = markResults[selected.id];

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      const storedCode = localStorage.getItem("codepaper-code");
      const storedMarks = localStorage.getItem("codepaper-marks");
      if (storedCode) setCodeById(JSON.parse(storedCode));
      if (storedMarks) setMarkResults(JSON.parse(storedMarks));
    });
    return () => window.clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (Object.keys(codeById).length) localStorage.setItem("codepaper-code", JSON.stringify(codeById));
  }, [codeById]);

  useEffect(() => {
    if (Object.keys(markResults).length) localStorage.setItem("codepaper-marks", JSON.stringify(markResults));
  }, [markResults]);

  useEffect(() => {
    const interval = window.setInterval(() => setElapsed((current) => current + 1), 1000);
    return () => window.clearInterval(interval);
  }, [selectedId]);

  useEffect(() => () => workerRef.current?.terminate(), []);

  const execute = useCallback((source: string, input: string[]) => {
    if (!workerRef.current) workerRef.current = new Worker("/pyodide-worker.js");
    const worker = workerRef.current;
    const id = ++jobRef.current;

    return new Promise<ExecutionResult>((resolve) => {
      const timeout = window.setTimeout(() => {
        worker.terminate();
        workerRef.current = null;
        runtimeReady.current = false;
        resolve({ output: "", error: "Execution reached the time limit. Check for an infinite loop or missing input." });
      }, runtimeReady.current ? 12000 : 30000);

      worker.onmessage = ({ data }: MessageEvent<WorkerResponse>) => {
        if (data.id !== id) return;
        window.clearTimeout(timeout);
        runtimeReady.current = true;
        resolve({ output: data.output, error: data.error });
      };
      worker.onerror = () => {
        window.clearTimeout(timeout);
        worker.terminate();
        workerRef.current = null;
        runtimeReady.current = false;
        resolve({ output: "", error: "The Python runtime could not start. Check your connection and try again." });
      };
      worker.postMessage({ id, code: source.slice(0, 50000), input: input.slice(0, 100) });
    });
  }, []);

  const runCurrent = useCallback(async () => {
    if (running || marking) return;
    setRunning(true);
    setPanel("console");
    setOutput("Starting Python…");
    const result = await execute(code, stdin.split("\n"));
    setOutput([result.output, result.error].filter(Boolean).join("\n") || "Program finished with no output.");
    setRunning(false);
  }, [code, execute, marking, running, stdin]);

  const submitCurrent = useCallback(async () => {
    if (running || marking) return;
    setMarking(true);
    setPanel("marking");
    const graded = [];

    for (const criterion of selected.criteria) {
      const checks: boolean[] = [];
      for (const pattern of criterion.codeAll ?? []) checks.push(new RegExp(pattern, "im").test(code));
      if (criterion.codeAny?.length) checks.push(criterion.codeAny.some((pattern) => new RegExp(pattern, "im").test(code)));
      for (const run of criterion.runs ?? []) {
        const result = await execute(code, run.input);
        checks.push(!result.error && run.outputAll.every((pattern) => new RegExp(pattern, "im").test(result.output)));
      }
      const passed = checks.filter(Boolean).length;
      graded.push({
        title: criterion.title,
        earned: checks.length ? Math.round((criterion.marks * passed) / checks.length) : criterion.marks,
        marks: criterion.marks,
        passed,
        checks: checks.length,
      });
    }

    const result = {
      score: graded.reduce((total, criterion) => total + criterion.earned, 0),
      total: selected.marks,
      criteria: graded,
    };
    setMarkResults((current) => ({ ...current, [selected.id]: result }));
    setMarking(false);
  }, [code, execute, marking, running, selected]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (!(event.metaKey || event.ctrlKey) || event.key !== "Enter") return;
      event.preventDefault();
      if (event.shiftKey) void submitCurrent();
      else void runCurrent();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [runCurrent, submitCurrent]);

  const sectionProgress = useMemo(() => {
    const answered = visibleQuestions.filter((question) => markResults[question.id]).length;
    return `${answered}/${visibleQuestions.length} marked`;
  }, [markResults, visibleQuestions]);

  const chooseQuestion = (id: string) => {
    setSelectedId(id);
    setOutput("Run your code to see its output here.");
    setPanel("console");
    setStdin("");
    setElapsed(0);
  };

  const resetCode = () => {
    setCodeById((current) => ({ ...current, [selected.id]: selected.starter }));
    setOutput("Starter code restored.");
    setPanel("console");
  };

  const minutes = String(Math.floor(elapsed / 60)).padStart(2, "0");
  const seconds = String(elapsed % 60).padStart(2, "0");

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <FileCode2 aria-hidden="true" size={22} />
          <div>
            <strong>CodePaper</strong>
            <p>Leaving Cert CS</p>
          </div>
        </div>

        <nav className="section-nav" aria-label="Question sections">
          {(Object.keys(sectionLabels) as (keyof typeof sectionLabels)[]).map((key) => (
            <button
              className={section === key ? "section-button active" : "section-button"}
              key={key}
              onClick={() => {
                setSection(key);
                const first = questions.find((question) => question.section === key);
                if (first) chooseQuestion(first.id);
              }}
              type="button"
            >
              {key === "short" ? <Terminal size={17} /> : <BookOpen size={17} />}
              {sectionLabels[key]}
            </button>
          ))}
        </nav>

        <div className="question-index-heading">
          <strong>{sectionLabels[section]}</strong>
          <span>{sectionProgress}</span>
        </div>
        <div className="question-index">
          {visibleQuestions.map((question) => {
            const result = markResults[question.id];
            return (
              <button
                className={question.id === selected.id ? "question-link active" : "question-link"}
                key={question.id}
                onClick={() => chooseQuestion(question.id)}
                type="button"
              >
                <span className="question-number">{question.year ? `${question.year} · ${question.part}` : `${question.marks} marks`}</span>
                <strong>{question.title}</strong>
                {result ? (
                  <span className="question-score"><CircleCheck size={14} /> {result.score}/{result.total}</span>
                ) : (
                  <ChevronRight className="question-chevron" size={16} />
                )}
              </button>
            );
          })}
        </div>
        <p className="sidebar-note">Work is saved in this browser.</p>
      </aside>

      <section className="workspace">
        <header className="toolbar">
          <div className="toolbar-title">
            <strong>{selected.year ? `${selected.year} ${selected.part}` : sectionLabels[selected.section]}</strong>
            <span>Python 3</span>
          </div>
          <div className="toolbar-actions">
            <div className="timer"><Clock3 size={15} /> {minutes}:{seconds}</div>
            <button className="button secondary" onClick={resetCode} type="button">
              <RotateCcw size={15} /> Reset
            </button>
            <button className="button secondary" disabled={running || marking} onClick={() => void runCurrent()} type="button">
              <Play size={15} fill="currentColor" /> {running ? "Running…" : "Run"}
            </button>
            <button className="button primary" disabled={running || marking} onClick={() => void submitCurrent()} type="button">
              <Send size={15} /> {marking ? "Marking…" : "Submit & mark"}
            </button>
          </div>
        </header>

        <div className="ide-grid">
          <article className="question-pane">
            <div className="question-heading">
              <div className="question-meta">
                <span>{selected.marks} marks</span>
                <span>{selected.minutes} minutes</span>
                <span>{selected.difficulty}</span>
              </div>
              <h1>{selected.title}</h1>
              <p>{selected.summary}</p>
            </div>

            <div className="task-block">
              <h2>Task</h2>
              <ol>
                {selected.instructions.map((instruction) => <li key={instruction}>{instruction}</li>)}
              </ol>
            </div>

            <div className="task-block mark-preview">
              <h2>Marks available</h2>
              {selected.criteria.map((criterion) => (
                <div className="mark-row" key={criterion.title}>
                  <span>{criterion.title}</span>
                  <strong>{criterion.marks}</strong>
                </div>
              ))}
            </div>

            {selected.sourceUrl ? (
              <div className="source-note">
                <p>Question wording is adapted for browser practice. The marking rubric follows the published scheme.</p>
                <a href={selected.sourceUrl} rel="noreferrer" target="_blank">
                  {selected.sourceLabel} <ExternalLink size={14} />
                </a>
              </div>
            ) : null}
          </article>

          <section className="editor-pane" aria-label="Python editor">
            <div className="editor-filebar">
              <span><FileCode2 size={15} /> solution.py</span>
              <span>⌘ Enter to run · ⇧ ⌘ Enter to mark</span>
            </div>
            <div className="editor-wrap">
              <CodeMirror
                basicSetup={{ autocompletion: true, bracketMatching: true, foldGutter: true, highlightActiveLine: true, lineNumbers: true }}
                extensions={[python()]}
                height="100%"
                onChange={(value) => setCodeById((current) => ({ ...current, [selected.id]: value.slice(0, 50000) }))}
                theme={oneDark}
                value={code}
              />
            </div>

            <div className="lower-panel">
              <div className="panel-tabs" role="tablist">
                <button aria-selected={panel === "console"} onClick={() => setPanel("console")} role="tab" type="button">
                  Console
                </button>
                <button aria-selected={panel === "marking"} onClick={() => setPanel("marking")} role="tab" type="button">
                  Marking {markResult ? `${markResult.score}/${markResult.total}` : ""}
                </button>
              </div>

              {panel === "console" ? (
                <div className="console-panel">
                  <div className="stdin-field">
                    <label htmlFor="stdin">Program input <span>one response per line</span></label>
                    <textarea
                      id="stdin"
                      maxLength={5000}
                      onChange={(event) => setStdin(event.target.value)}
                      placeholder={selected.instructions.some((instruction) => instruction.toLowerCase().includes("input")) ? "Enter test input here" : "No input needed for this task"}
                      rows={2}
                      value={stdin}
                    />
                  </div>
                  <pre aria-live="polite">{output}</pre>
                </div>
              ) : (
                <div className="marking-panel" aria-live="polite">
                  {marking ? <p className="marking-empty">Running rubric checks…</p> : null}
                  {!marking && !markResult ? <p className="marking-empty">Submit your solution to run the marking scheme.</p> : null}
                  {!marking && markResult ? (
                    <>
                      <div className="mark-total">
                        <div>
                          <strong>{Math.round((markResult.score / markResult.total) * 100)}%</strong>
                          <span>{markResult.score} of {markResult.total} marks</span>
                        </div>
                        <p>{markResult.score === markResult.total ? "All rubric checks passed." : "Review the unchecked requirements, then submit again."}</p>
                      </div>
                      <div className="criteria-results">
                        {markResult.criteria.map((criterion) => (
                          <div className="criterion-result" key={criterion.title}>
                            <div className={criterion.earned === criterion.marks ? "criterion-icon passed" : "criterion-icon"}>
                              {criterion.earned === criterion.marks ? <Check size={14} /> : criterion.earned}
                            </div>
                            <span>{criterion.title}</span>
                            <strong>{criterion.earned}/{criterion.marks}</strong>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : null}
                </div>
              )}
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}

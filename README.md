# CodePaper

A browser-based Python IDE for Leaving Certificate Computer Science practice.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`. Python runs locally in a time-limited Web Worker using Pyodide. Code and marking results stay in the browser.

## Question bank

- Five original short programming drills
- Official Higher Level Section C adaptations from 2022, 2023, 2024 and 2025
- One public mock-paper adaptation
- Rubric marks based on the published SEC marking schemes

The app links to each source paper instead of republishing complete PDFs. Commercial mock papers are not included.

## Production rendering

The home page renders on each request because `proxy.ts` creates a fresh CSP nonce.
Keep this route dynamic so Next.js applies that nonce to its startup scripts; statically
rendering it blocks hydration and leaves navigation, editing and execution unresponsive.

## Checks

```bash
npm run lint
npm run build
npm audit
```

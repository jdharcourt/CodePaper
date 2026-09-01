export type GradeRun = {
  input: string[];
  outputAll: string[];
};

export type Criterion = {
  title: string;
  marks: number;
  codeAll?: string[];
  codeAny?: string[];
  runs?: GradeRun[];
};

export type Question = {
  id: string;
  section: "short" | "exam" | "mock";
  year?: number;
  part?: string;
  title: string;
  summary: string;
  marks: number;
  minutes: number;
  difficulty: "Foundation" | "Standard" | "Challenge";
  instructions: string[];
  starter: string;
  criteria: Criterion[];
  sourceUrl?: string;
  sourceLabel?: string;
};

const sec2025 = "https://www.examinations.ie/archive/exampapers/2025/LC219ALP040EV.pdf";
const sec2024 = "https://www.examinations.ie/archive/exampapers/2024/LC219ALP040EV.pdf";
const sec2023 = "https://www.examinations.ie/archive/exampapers/2023/LC219ALP040EV.pdf";
const sec2022 = "https://www.examinations.ie/archive/exampapers/2022/LC219ALP040EV.pdf";

export const questions: Question[] = [
  {
    id: "short-even-odd",
    section: "short",
    title: "Even or odd",
    summary: "Read an integer and classify it using the remainder operator.",
    marks: 10,
    minutes: 5,
    difficulty: "Foundation",
    instructions: [
      "Ask the user to enter an integer.",
      "Print Even when it is divisible by 2; otherwise print Odd.",
      "Your program must also work for zero and negative integers.",
    ],
    starter: "number = int(input(\"Enter an integer: \"))\n\n",
    criteria: [
      { title: "Reads and converts an integer", marks: 3, codeAll: ["int\\s*\\(", "input\\s*\\("] },
      { title: "Uses a correct parity test", marks: 3, codeAll: ["%\\s*2"] },
      {
        title: "Handles even and odd values",
        marks: 4,
        runs: [
          { input: ["8"], outputAll: ["even"] },
          { input: ["-3"], outputAll: ["odd"] },
          { input: ["0"], outputAll: ["even"] },
        ],
      },
    ],
  },
  {
    id: "short-average",
    section: "short",
    title: "Class average",
    summary: "Calculate a rounded mean from a comma-separated list of results.",
    marks: 15,
    minutes: 8,
    difficulty: "Standard",
    instructions: [
      "Read percentage results separated by commas.",
      "Convert each result to a number and calculate the arithmetic mean.",
      "Print the mean rounded to two decimal places. Print No results when the input is empty.",
    ],
    starter: "raw_results = input(\"Results: \")\n",
    criteria: [
      { title: "Splits and converts the values", marks: 5, codeAll: ["\\.split\\s*\\(", "(int|float)\\s*\\("] },
      { title: "Calculates the mean from the list length", marks: 4, codeAll: ["(sum\\s*\\(|total)", "len\\s*\\("] },
      {
        title: "Formats valid and empty inputs",
        marks: 6,
        runs: [
          { input: ["60,75,82,91"], outputAll: ["77\\.0{1,2}"] },
          { input: [""], outputAll: ["no results"] },
        ],
      },
    ],
  },
  {
    id: "short-vowels",
    section: "short",
    title: "Count vowels",
    summary: "Traverse text and count vowels without case sensitivity.",
    marks: 12,
    minutes: 7,
    difficulty: "Foundation",
    instructions: [
      "Read a line of text.",
      "Count a, e, i, o and u in upper- or lower-case.",
      "Display only the final count in a meaningful message.",
    ],
    starter: "text = input(\"Text: \")\n",
    criteria: [
      { title: "Iterates through the text", marks: 4, codeAll: ["for\\s+\\w+\\s+in"] },
      { title: "Checks all vowels without case sensitivity", marks: 4, codeAll: ["aeiou", "\\.lower\\s*\\("] },
      {
        title: "Produces the correct count",
        marks: 4,
        runs: [
          { input: ["Leaving Certificate"], outputAll: ["7"] },
          { input: ["rhythms"], outputAll: ["0"] },
        ],
      },
    ],
  },
  {
    id: "short-search",
    section: "short",
    title: "First matching result",
    summary: "Implement a linear search and report the first matching position.",
    marks: 15,
    minutes: 9,
    difficulty: "Standard",
    instructions: [
      "Use the supplied list of names and ask for a search name.",
      "Search without case sensitivity.",
      "Print the zero-based index of the first match, or Not found.",
      "Do not use list.index().",
    ],
    starter: "names = [\"Aoife\", \"Ben\", \"Cara\", \"Ben\", \"Dara\"]\nsearch_name = input(\"Name: \")\n",
    criteria: [
      { title: "Traverses the list without list.index", marks: 5, codeAll: ["(for|while)\\s+"], codeAny: ["enumerate\\s*\\(", "range\\s*\\("] },
      { title: "Compares without case sensitivity", marks: 4, codeAll: ["\\.lower\\s*\\("] },
      {
        title: "Reports the first match or failure",
        marks: 6,
        runs: [
          { input: ["ben"], outputAll: ["1"] },
          { input: ["Eoin"], outputAll: ["not found"] },
        ],
      },
    ],
  },
  {
    id: "short-password",
    section: "short",
    title: "Password rules",
    summary: "Validate a string against several independent requirements.",
    marks: 18,
    minutes: 10,
    difficulty: "Challenge",
    instructions: [
      "A password is valid when it has at least 8 characters, an uppercase letter and a digit.",
      "Read one password and print Valid or Invalid.",
      "Use iteration and string methods rather than regular expressions.",
    ],
    starter: "password = input(\"Password: \" )\n",
    criteria: [
      { title: "Checks the minimum length", marks: 4, codeAll: ["len\\s*\\(", ">=\\s*8"] },
      { title: "Checks uppercase and numeric characters", marks: 6, codeAll: ["\\.isupper\\s*\\(", "\\.isdigit\\s*\\("] },
      {
        title: "Combines all rules correctly",
        marks: 8,
        runs: [
          { input: ["Code2025"], outputAll: ["valid"] },
          { input: ["code2025"], outputAll: ["invalid"] },
          { input: ["CodeOnly"], outputAll: ["invalid"] },
        ],
      },
    ],
  },
  {
    id: "exam-2025-a",
    section: "exam",
    year: 2025,
    part: "16(a)",
    title: "Results analysis",
    summary: "Complete the official results-processing program, then find the longest increasing run.",
    marks: 50,
    minutes: 35,
    difficulty: "Challenge",
    instructions: [
      "Round the mean to two decimal places and divide by the list length rather than a fixed value.",
      "Complete get_grade for Distinction (80+), Upper Merit (65+), Lower Merit (50+), Pass (40+) and Unsuccessful.",
      "Display the grade, lowest score, highest score, count below 40 and count from 50 to 79 inclusive.",
      "Find and display the longest run of consecutive increases. For the supplied data it is [51, 62, 64, 81].",
    ],
    starter: `def get_grade(result):
    grade = "Unsuccessful"
    if result >= 80:
        grade = "Distinction"
    elif result >= 65:
        grade = "Upper Merit"
    return grade

results = [39, 32, 62, 88, 51, 62, 64, 81, 77]
total = 0
for result in results:
    total += result

arithmetic_mean = total / 9
print("The mean percentage mark is", arithmetic_mean)
`,
    criteria: [
      { title: "Rounds the mean to two decimal places", marks: 5, codeAll: ["round\\s*\\([^\\n]+,\\s*2\\s*\\)"], runs: [{ input: [], outputAll: ["61\\.78"] }] },
      { title: "Uses the list length as the divisor", marks: 5, codeAll: ["/\\s*(len\\s*\\(results\\)|N)"] },
      { title: "Completes all grade boundaries", marks: 5, codeAll: ["Lower Merit", "Pass", "Unsuccessful"] },
      { title: "Calls get_grade and displays Lower Merit", marks: 5, codeAll: ["get_grade\\s*\\(arithmetic_mean\\)"], runs: [{ input: [], outputAll: ["lower merit"] }] },
      { title: "Finds and displays the lowest and highest scores", marks: 5, codeAll: ["(min\\s*\\(results\\)|lowest)", "(max\\s*\\(results\\)|highest)"], runs: [{ input: [], outputAll: ["32", "88"] }] },
      { title: "Counts both requested score ranges", marks: 10, codeAll: ["<\\s*40", ">=\\s*50", "<=\\s*79"], runs: [{ input: [], outputAll: ["2", "5"] }] },
      { title: "Finds the complete longest increasing run", marks: 15, codeAll: ["current_run", "longest_run"], runs: [{ input: [], outputAll: ["\\[51,\\s*62,\\s*64,\\s*81\\]"] }] },
    ],
    sourceUrl: sec2025,
    sourceLabel: "Official SEC 2025 Section C paper",
  },
  {
    id: "exam-2025-b",
    section: "exam",
    year: 2025,
    part: "16(b)",
    title: "Median without a library",
    summary: "Write the official median task for odd, even and empty lists.",
    marks: 30,
    minutes: 25,
    difficulty: "Standard",
    instructions: [
      "Initialise and display a list of integers, sort it and display the sorted list.",
      "Calculate the middle value for an odd-length list and the mean of the two middle values for an even-length list.",
      "Display an error message when the list is empty.",
      "Do not use statistics.median, numpy.median or another library median function.",
    ],
    starter: "values = [27, 13, 32, 50, 16]\n",
    criteria: [
      { title: "Initialises, displays and sorts the list", marks: 8, codeAll: ["values\\s*=\\s*\\[", "(\\.sort\\s*\\(|sorted\\s*\\()", "print\\s*\\("] },
      { title: "Handles an empty list", marks: 6, codeAll: ["len\\s*\\(values\\)\\s*==\\s*0|if\\s+not\\s+values", "empty"] },
      { title: "Calculates the odd-length median", marks: 7, codeAll: ["%\\s*2", "//\\s*2"] },
      { title: "Calculates the even-length median", marks: 7, codeAll: ["//\\s*2", "/\\s*2"] },
      { title: "Explains the main steps with comments", marks: 2, codeAll: ["#"] },
    ],
    sourceUrl: sec2025,
    sourceLabel: "Official SEC 2025 Section C paper",
  },
  {
    id: "exam-2024-a",
    section: "exam",
    year: 2024,
    part: "16(a)",
    title: "Random fruit analysis",
    summary: "Extend the official random-choice starter and analyse 100 selections.",
    marks: 50,
    minutes: 35,
    difficulty: "Standard",
    instructions: [
      "Choose and display three random fruits from apple, cherry and orange.",
      "Report when the first is cherry, the first pair match, the first pair are cherries, or any pair matches.",
      "Run 100 further choices and display the frequency of each fruit.",
    ],
    starter: "from random import choice\n\nfruits = ['apple', 'cherry', 'orange']\nrandom_fruit_1 = choice(fruits)\n",
    criteria: [
      { title: "Displays three independently selected fruits", marks: 10, codeAll: ["random_fruit_1", "random_fruit_2", "random_fruit_3", "choice\\s*\\("] },
      { title: "Checks the first fruit and first pair", marks: 10, codeAll: ["First fruit is cherry", "First pair match"] },
      { title: "Checks a pair of cherries", marks: 5, codeAll: ["First pair are cherries"] },
      { title: "Detects a match in any pair", marks: 10, codeAll: ["Matching pair"], codeAny: ["or", "set\\s*\\(", "count\\s*\\("] },
      { title: "Runs 100 trials and counts every fruit", marks: 15, codeAll: ["range\\s*\\(100\\)", "apple", "cherry", "orange"], codeAny: ["dict", "count", "frequencies"] },
    ],
    sourceUrl: sec2024,
    sourceLabel: "Official SEC 2024 Section C paper",
  },
  {
    id: "exam-2024-b",
    section: "exam",
    year: 2024,
    part: "16(b)",
    title: "Fruit machine simulation",
    summary: "Build the official fruit-machine program with validation and repeated random trials.",
    marks: 30,
    minutes: 25,
    difficulty: "Challenge",
    instructions: [
      "Start with apple, cherry and orange; ask for and append a fourth fruit.",
      "Ask for a winning fruit until the entered value is in the list.",
      "Repeatedly choose three random fruits until all three equal the winning fruit.",
      "Count the attempts and display Winner after [count] tries.",
    ],
    starter: "from random import choice\n\nfruits = ['apple', 'cherry', 'orange']\n",
    criteria: [
      { title: "Adds and displays a fourth fruit", marks: 6, codeAll: ["input\\s*\\(", "\\.append\\s*\\(", "print\\s*\\("] },
      { title: "Validates the selected winning fruit", marks: 7, codeAll: ["while", "not in\\s+fruits"] },
      { title: "Selects three random fruits per attempt", marks: 7, codeAll: ["choice\\s*\\(fruits\\)"], codeAny: ["range\\s*\\(3\\)", "random_fruit_3", "three"] },
      { title: "Loops until all three match", marks: 6, codeAll: ["while"], codeAny: ["==\\s*winning_fruit", "all\\s*\\("] },
      { title: "Counts and displays the tries", marks: 4, codeAll: ["tries", "Winner"] },
    ],
    sourceUrl: sec2024,
    sourceLabel: "Official SEC 2024 Section C paper",
  },
  {
    id: "exam-2023-a",
    section: "exam",
    year: 2023,
    part: "16(a)",
    title: "Guessing game limits",
    summary: "Complete the official guessing game with hints, difficulty and duplicate detection.",
    marks: 50,
    minutes: 35,
    difficulty: "Challenge",
    instructions: [
      "Display the number of guesses taken and give too-low or too-high hints.",
      "Stop when max_guesses_allowed is reached and ask the user for that limit.",
      "Add E/H difficulty: hard uses 1–100 and other values use 1–5.",
      "Remember prior guesses and warn when a number is entered again.",
    ],
    starter: `from random import randint

def guess_game(max_guesses_allowed):
    secret_number = randint(1, 5)
    guess_count = 0
    user_guess = 0
    while user_guess != secret_number:
        user_guess = int(input("Enter your guess: "))
        guess_count += 1
        if user_guess == secret_number:
            print("Congratulations! You win!")

print("Welcome to the guessing game!")
guess_game(3)
`,
    criteria: [
      { title: "Displays the number of guesses", marks: 5, codeAll: ["guess_count", "print\\s*\\("] },
      { title: "Gives lower and higher hints", marks: 10, codeAll: ["too low", "too high", "<", ">"] },
      { title: "Stops at the supplied guess limit", marks: 10, codeAll: ["max_guesses_allowed", "guess_count\\s*<"] },
      { title: "Reads and passes the maximum guesses", marks: 5, codeAll: ["int\\s*\\(input", "guess_game\\s*\\("] },
      { title: "Implements E/H difficulty ranges", marks: 10, codeAll: ["difficulty", "100", "5"] },
      { title: "Detects repeated guesses", marks: 10, codeAll: ["already guessed"], codeAny: ["set\\s*\\(", "\\[\\]", "guesses"] },
    ],
    sourceUrl: sec2023,
    sourceLabel: "Official SEC 2023 Section C paper",
  },
  {
    id: "exam-2023-b",
    section: "exam",
    year: 2023,
    part: "16(b)",
    title: "Points guessing game",
    summary: "Build the official replayable game and score guesses by distance.",
    marks: 30,
    minutes: 25,
    difficulty: "Standard",
    instructions: [
      "Generate a secret number from 1 to 100 each round and read a guess.",
      "Display the secret, guess and absolute difference.",
      "Award 100 for an exact match, 20 when within 20, and subtract 30 when more than 30 away.",
      "Display the total and repeat only while the player enters Y.",
    ],
    starter: "from random import randint\n\nscore = 0\nplay_again = 'Y'\n",
    criteria: [
      { title: "Generates a new secret and reads a guess", marks: 5, codeAll: ["randint\\s*\\(1,\\s*100\\)", "int\\s*\\(input"] },
      { title: "Calculates and displays absolute difference", marks: 5, codeAll: ["abs\\s*\\(", "difference", "print\\s*\\("] },
      { title: "Awards the jackpot correctly", marks: 5, codeAll: ["==", "100", "JACKPOT"] },
      { title: "Applies the 20 and −30 rules", marks: 7, codeAll: ["<=\\s*20", ">\\s*30", "20", "30"] },
      { title: "Tracks and displays the total score", marks: 4, codeAll: ["score", "print\\s*\\("] },
      { title: "Repeats only for Y", marks: 4, codeAll: ["while", "Y", "Play again"] },
    ],
    sourceUrl: sec2023,
    sourceLabel: "Official SEC 2023 Section C paper",
  },
  {
    id: "exam-2022-a",
    section: "exam",
    year: 2022,
    part: "16(a)",
    title: "Dice simulation and analysis",
    summary: "Complete the official 100-roll simulation, table, mode and text chart.",
    marks: 50,
    minutes: 45,
    difficulty: "Standard",
    instructions: [
      "Simulate 100 six-sided die rolls and count every face in a six-element frequency list.",
      "Display a two-column table containing each die value and frequency.",
      "Find and display the most frequently rolled value and its count. Ties may be ignored.",
      "Display a horizontal bar for each face using one asterisk per occurrence.",
    ],
    starter: `from random import randint

print("Dice simulation program")
results = []
frequencies = [0, 0, 0, 0, 0, 0]

for i in range(100):
    throw_result = randint(1, 6)
    results.append(throw_result)
    if throw_result == 1:
        frequencies[0] += 1
    elif throw_result == 2:
        frequencies[1] += 1

print("Results:", results)
`,
    criteria: [
      { title: "Uses the required heading and displays frequencies", marks: 5, codeAll: ["Dice simulation and analysis", "frequencies", "print\\s*\\("] },
      { title: "Counts all six die values", marks: 10, codeAll: ["range\\s*\\(100\\)", "frequencies"], codeAny: ["frequencies\\[throw_result\\s*-\\s*1\\]", "elif\\s+throw_result\\s*==\\s*6"] },
      { title: "Displays the frequency table", marks: 10, codeAll: ["Dice", "Frequency", "for"] },
      { title: "Finds the most common value and count", marks: 10, codeAll: ["max\\s*\\(frequencies\\)"], codeAny: ["index\\s*\\(", "most"] },
      { title: "Draws six correctly scaled text bars", marks: 15, codeAll: ["\\*", "frequencies", "for"] },
    ],
    sourceUrl: sec2022,
    sourceLabel: "Official SEC 2022 Section C paper",
  },
  {
    id: "mock-fruit-shop",
    section: "mock",
    title: "Fruit shop checkout",
    summary: "A public mock-paper adaptation covering parallel lists, validation and totals.",
    marks: 40,
    minutes: 30,
    difficulty: "Standard",
    instructions: [
      "Use the matching fruits and prices lists to build a basket.",
      "Repeatedly ask for a fruit until the user enters done. Reject fruit not in the list.",
      "Append each valid selection and add its corresponding price to the total.",
      "Display the basket and the total formatted to two decimal places.",
    ],
    starter: `fruits = ["apple", "orange", "banana", "pineapple", "kiwi", "mango"]
prices = [0.60, 0.30, 0.40, 1.50, 0.40, 1.00]
basket = []
total = 0.0
`,
    criteria: [
      { title: "Loops until done", marks: 8, codeAll: ["while", "input\\s*\\(", "done"] },
      { title: "Rejects unavailable fruit", marks: 7, codeAll: ["not in\\s+fruits", "print\\s*\\("] },
      { title: "Adds valid selections to the basket", marks: 7, codeAll: ["basket\\.append\\s*\\("] },
      { title: "Uses corresponding list positions for prices", marks: 8, codeAll: ["prices\\["], codeAny: ["fruits\\.index\\s*\\(", "enumerate\\s*\\("] },
      { title: "Prints basket and a two-decimal total", marks: 10, codeAll: ["basket", "total"], codeAny: ["\\.2f", "round\\s*\\([^\\n]+,\\s*2"] },
    ],
    sourceUrl: "https://blob-static.studyclix.ie/static/content/file/attachments/5/5d5a4177-9d08-4c62-a875-abdfe94a3e2a/LCCS%20HL%20Section%20C%20Mock.pdf",
    sourceLabel: "Public LCCS Section C mock paper",
  },
];

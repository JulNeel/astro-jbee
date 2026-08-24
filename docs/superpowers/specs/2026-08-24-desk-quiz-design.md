# Desk quiz game — design

## Purpose

A 30-question guessing quiz on the à-propos page, placed directly below the
interactive desk illustration. Each question is a cryptic clue inspired by
one of the desk's objects/easter eggs (no direct link is exposed to the
user — they must deduce the connection themselves). The user types a
free-text answer per question and submits the whole form at once; a modal
then reports their score and which questions they missed.

## Non-goals

- No backend/persistence. The quiz is entirely client-side and ephemeral —
  nothing is stored between page loads, no server round-trip, no analytics.
- No timer, no scoring beyond a simple correct/incorrect count, no partial
  credit for near-miss answers.
- No reveal of correct answers anywhere in the UI (keeps the quiz
  replayable and avoids trivializing the desk's easter eggs).

## Data

`src/data/quiz-questions.ts` already exists:

```ts
export interface QuizQuestion {
  id: string;
  question: string;
  acceptedAnswers: string[];
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [ /* 30 entries, filled in */ ];
```

## Answer matching

`src/utils/normalizeAnswer.ts` (new): a single pure function used on both
the user's input and every string in `acceptedAnswers` before comparing:

```ts
export function normalizeAnswer(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // strip combining diacritical marks
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " "); // collapse repeated whitespace
}
```

A question is correct when `normalizeAnswer(userInput)` equals
`normalizeAnswer(candidate)` for at least one `candidate` in
`acceptedAnswers`. An empty/whitespace-only input is never correct.

## Component

`src/components/QuizGame.tsx` (new), a React component mounted with
`client:load` in `src/pages/a-propos.astro`, directly after the existing
`<InteractiveDesk client:load />`.

### State

```ts
const [answers, setAnswers] = useState<Record<string, string>>({});
const [result, setResult] = useState<{ score: number; missed: string[] } | null>(null);
```

- `answers`: keyed by `QuizQuestion.id`, updated on each input's `onChange`.
- `result`: `null` while the form is open; set on submit, which is also
  what triggers the modal to render. `missed` holds the `question` text
  (not the id) of every question the user got wrong, for direct display.

### Rendering

- A `<form>` listing all 30 questions in order, each as a `<label>` +
  controlled `<input type="text">` pair (no `required` attribute — blank
  answers are simply scored as incorrect, per the "free submission"
  decision).
- A submit button ("Valider mes réponses").
- On submit (`preventDefault`): for each question, look up
  `answers[question.id] ?? ""`, run the matching check above, accumulate
  `score` and `missed`, then `setResult(...)`.
- When `result` is non-null, render the modal (see below) in addition to
  the form (the form stays mounted underneath so state isn't lost if the
  user closes the modal without clicking "Recommencer").

### Modal

- Shown when `result !== null`.
- Content: "Score : {result.score}/30", then the list of
  `result.missed` question texts (no correct answers shown).
- "Recommencer" button: `setAnswers({})`, `setResult(null)` — clears the
  form for a fresh attempt. No attempt limit.
- Accessibility: `role="dialog"`, `aria-modal="true"`, a visible close
  affordance, and focus moved to the modal on open and back to the
  submit button on close — matching the care already taken in
  `InteractiveDesk`'s tooltip handling.

### Accessibility (form)

Every input is associated with its question via `htmlFor`/`id` so screen
readers announce the question text when the input receives focus.

## Testing

- Manual: fill a mix of correct/incorrect/blank answers, verify score and
  missed list are accurate, verify accent/case-insensitive matching (e.g.
  "sncf", "SNCF", "sncf " all match), verify "Recommencer" fully resets
  the form, verify keyboard-only submission and modal dismissal work.
- No automated test suite exists for `InteractiveDesk` either, so no new
  testing infrastructure is introduced here — consistent with the rest of
  the codebase.

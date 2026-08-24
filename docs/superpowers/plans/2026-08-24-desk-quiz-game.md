# Desk Quiz Game Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a 30-question guessing quiz below the interactive desk on the à-propos page, with score + missed-questions feedback in a modal on submit.

**Architecture:** A pure `normalizeAnswer` utility does accent/case/whitespace-insensitive string comparison. A single client-rendered React component (`QuizGame`) owns all form state (answers, submission result) and renders both the question form and the result modal from that state. It's mounted on the existing à-propos page, right after the interactive desk.

**Tech Stack:** Astro, React (`client:load` islands, matching `InteractiveDesk`), TypeScript, Tailwind CSS v4.

**Spec:** `docs/superpowers/specs/2026-08-24-desk-quiz-design.md`

## Global Constraints

- No backend/persistence — entirely client-side, nothing stored between page loads (spec: Non-goals).
- No timer, no partial credit — a question is either correct or not (spec: Non-goals).
- Never reveal correct answers in the UI, only which questions were missed (spec: Non-goals, Modal).
- No new automated test framework — this codebase has none (confirmed: no `vitest`/`jest`/`testing-library` in `package.json`, no `tests/` directory). Verification is `tsc`/`astro check` for types plus manual browser checks, matching how `InteractiveDesk` was built and verified. Any throwaway verification script used mid-task is deleted before the task's commit — never committed.
- Match existing code style: double quotes, no semicolons omitted (existing files use semicolons), Tailwind utility classes inline, no CSS files added.

---

### Task 1: `normalizeAnswer` utility

**Files:**
- Create: `src/utils/normalizeAnswer.ts`

**Interfaces:**
- Consumes: nothing (pure function, no project dependencies).
- Produces: `normalizeAnswer(value: string): string`, exported for Task 2 to import as `import { normalizeAnswer } from "../utils/normalizeAnswer"`.

- [ ] **Step 1: Write the implementation**

Create `src/utils/normalizeAnswer.ts`:

```ts
// Case/accent/whitespace-insensitive normalization for free-text quiz answers.
// "  Sarah Bernhardt " and "sarah bernhardt" and "SARAH BERNHARDT" must all
// normalize to the same string so answer matching doesn't punish incidental
// formatting differences.
export function normalizeAnswer(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // strip combining diacritical marks
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " "); // collapse repeated whitespace
}
```

- [ ] **Step 2: Verify with a throwaway script**

Create a temporary file `src/utils/normalizeAnswer.scratch.ts`:

```ts
import { normalizeAnswer } from "./normalizeAnswer";

const cases: Array<[string, string]> = [
  ["Sarah Bernhardt", "sarah bernhardt"],
  ["  SNCF ", "sncf"],
  ["Crédit Lyonnais", "credit lyonnais"],
  ["My   Adidas", "my adidas"],
  ["", ""],
];

let failed = false;
for (const [input, expected] of cases) {
  const actual = normalizeAnswer(input);
  if (actual !== expected) {
    failed = true;
    console.error(`FAIL: normalizeAnswer(${JSON.stringify(input)}) = ${JSON.stringify(actual)}, expected ${JSON.stringify(expected)}`);
  }
}
console.log(failed ? "FAILED" : "all cases passed");
```

Run: `npx tsx src/utils/normalizeAnswer.scratch.ts`
Expected output: `all cases passed`

If it prints `FAILED` with mismatch lines, fix `normalizeAnswer` and re-run until it passes.

- [ ] **Step 3: Delete the throwaway script**

```bash
rm src/utils/normalizeAnswer.scratch.ts
```

- [ ] **Step 4: Typecheck**

Run: `npx tsc --noEmit -p tsconfig.json`
Expected: no output (no errors).

- [ ] **Step 5: Commit**

```bash
git add src/utils/normalizeAnswer.ts
git commit -m "feat: add normalizeAnswer utility for quiz answer matching"
```

---

### Task 2: `QuizGame` form with working score submission

**Files:**
- Create: `src/components/QuizGame.tsx`

**Interfaces:**
- Consumes:
  - `QuizQuestion` type and `QUIZ_QUESTIONS` array from `src/data/quiz-questions.ts` (`{ id: string; question: string; acceptedAnswers: string[] }[]`).
  - `normalizeAnswer(value: string): string` from `src/utils/normalizeAnswer.ts` (Task 1).
- Produces: default-exported `QuizGame` React component with no props, for Task 4 to mount as `<QuizGame client:load />`. Internally defines `QuizResult = { score: number; missed: string[] }`, which Task 3 will reuse when it takes over rendering the result.

- [ ] **Step 1: Write the component**

Create `src/components/QuizGame.tsx`:

```tsx
import { useState } from "react";
import { QUIZ_QUESTIONS } from "../data/quiz-questions";
import { normalizeAnswer } from "../utils/normalizeAnswer";

interface QuizResult {
  score: number;
  missed: string[];
}

export default function QuizGame() {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<QuizResult | null>(null);

  const handleChange = (id: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let score = 0;
    const missed: string[] = [];
    for (const q of QUIZ_QUESTIONS) {
      const given = normalizeAnswer(answers[q.id] ?? "");
      const isCorrect =
        given.length > 0 &&
        q.acceptedAnswers.some((a) => normalizeAnswer(a) === given);
      if (isCorrect) {
        score += 1;
      } else {
        missed.push(q.question);
      }
    }
    setResult({ score, missed });
  };

  return (
    <div className="mx-auto w-full max-w-3xl">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {QUIZ_QUESTIONS.map((q) => (
          <div key={q.id} className="flex flex-col gap-1">
            <label htmlFor={`quiz-${q.id}`} className="text-foreground text-sm font-medium">
              {q.question}
            </label>
            <input
              id={`quiz-${q.id}`}
              type="text"
              value={answers[q.id] ?? ""}
              onChange={(e) => handleChange(q.id, e.target.value)}
              className="border-border bg-background-card text-foreground-card rounded-lg border px-3 py-2 text-sm"
            />
          </div>
        ))}
        <button
          type="submit"
          className="bg-primary hover:bg-primary-dark self-start rounded-xl px-6 py-2 text-sm font-semibold text-white transition-colors"
        >
          Valider mes réponses
        </button>
      </form>
      {result && (
        <p className="mt-4 text-lg font-semibold">
          Score : {result.score}/{QUIZ_QUESTIONS.length}
        </p>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit -p tsconfig.json`
Expected: no output (no errors).

- [ ] **Step 3: Manual browser verification**

Run: `pnpm dev` (note the printed local URL, e.g. `http://localhost:4321/`)

In a browser, navigate to `/a-propos` — `QuizGame` isn't mounted on the page yet (that's Task 4), so instead verify it in isolation:

1. Temporarily add `import QuizGame from "../components/QuizGame";` and `<QuizGame client:load />` right after `<InteractiveDesk client:load />` in `src/pages/a-propos.astro`.
2. Reload `/a-propos`, scroll to the bottom of the interactive desk section.
3. Confirm all 30 questions render with a text input each.
4. Type a correct answer for a couple of questions (e.g. "Nirvana" for the first) and an incorrect one for others, leave some blank.
5. Click "Valider mes réponses" — confirm a "Score : N/30" line appears with the right count (correct answers only; blanks and wrong answers don't count).
6. Revert the temporary `a-propos.astro` edit (Task 4 does this properly) — run `git checkout -- src/pages/a-propos.astro` to discard it.

Stop the dev server (Ctrl+C) once verified.

- [ ] **Step 4: Commit**

```bash
git add src/components/QuizGame.tsx
git commit -m "feat: add QuizGame form with scoring"
```

---

### Task 3: Result modal with missed-questions list and replay

**Files:**
- Modify: `src/components/QuizGame.tsx`

**Interfaces:**
- Consumes: `QuizResult` type and `result`/`setResult`/`setAnswers` state already defined in Task 2 (same file, no new imports needed beyond `useEffect`, `useRef` from `"react"`).
- Produces: no new exports — `QuizGame`'s default export signature is unchanged, only its rendered output changes (plain score text is replaced by an accessible modal).

- [ ] **Step 1: Replace the plain score text with a modal**

In `src/components/QuizGame.tsx`, add `useEffect` and `useRef` to the React import:

```tsx
import { useEffect, useRef, useState } from "react";
```

Add two refs and a reset handler inside `QuizGame`, right after the `handleSubmit` function:

```tsx
  const dialogRef = useRef<HTMLDivElement>(null);
  const submitButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (result) {
      dialogRef.current?.focus();
    }
  }, [result]);

  const handleRestart = () => {
    setAnswers({});
    setResult(null);
    submitButtonRef.current?.focus();
  };
```

Add `ref={submitButtonRef}` to the existing submit `<button>` element.

Replace the block:

```tsx
      {result && (
        <p className="mt-4 text-lg font-semibold">
          Score : {result.score}/{QUIZ_QUESTIONS.length}
        </p>
      )}
```

with:

```tsx
      {result && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={handleRestart}
        >
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="quiz-result-title"
            tabIndex={-1}
            onClick={(e) => e.stopPropagation()}
            className="bg-background-card text-foreground-card max-h-[80vh] w-full max-w-md overflow-y-auto rounded-2xl p-6 shadow-xl"
          >
            <h2 id="quiz-result-title" className="text-xl font-bold">
              Score : {result.score}/{QUIZ_QUESTIONS.length}
            </h2>
            {result.missed.length > 0 && (
              <>
                <p className="mt-4 text-sm font-medium">Questions ratées :</p>
                <ul className="mt-2 list-disc pl-5 text-sm">
                  {result.missed.map((question) => (
                    <li key={question}>{question}</li>
                  ))}
                </ul>
              </>
            )}
            <button
              type="button"
              onClick={handleRestart}
              className="bg-primary hover:bg-primary-dark mt-6 rounded-xl px-6 py-2 text-sm font-semibold text-white transition-colors"
            >
              Recommencer
            </button>
          </div>
        </div>
      )}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit -p tsconfig.json`
Expected: no output (no errors).

- [ ] **Step 3: Manual browser verification**

Repeat the temporary mount from Task 2 Step 3 (add the import + `<QuizGame client:load />` to `a-propos.astro`, run `pnpm dev`, reload `/a-propos`):

1. Fill some correct, some incorrect, leave some blank; submit.
2. Confirm the modal opens showing "Score : N/30" and a bullet list of the missed questions' text (not their answers).
3. Confirm clicking the dark overlay outside the dialog closes it and clears the form (inputs are empty again).
4. Resubmit with different answers and confirm "Recommencer" also resets and closes.
5. Tab through the form with the keyboard only, confirm the submit button is reachable and, after submitting, focus lands inside the dialog.

Revert the temporary mount again: `git checkout -- src/pages/a-propos.astro`. Stop the dev server.

- [ ] **Step 4: Commit**

```bash
git add src/components/QuizGame.tsx
git commit -m "feat: turn quiz result into an accessible modal with replay"
```

---

### Task 4: Mount `QuizGame` on the à-propos page

**Files:**
- Modify: `src/pages/a-propos.astro:6` (imports) and `:100` (render, right after `<InteractiveDesk client:load />`)

**Interfaces:**
- Consumes: default-exported `QuizGame` component from `src/components/QuizGame.tsx` (Task 2/3), no props.
- Produces: nothing consumed by later tasks — this is the last task.

- [ ] **Step 1: Add the import**

In `src/pages/a-propos.astro`, after the existing `import InteractiveDesk from "@components/InteractiveDesk";` line, add:

```astro
import QuizGame from "@components/QuizGame";
```

- [ ] **Step 2: Mount the component**

Find `<InteractiveDesk client:load />` in the template and add `<QuizGame client:load />` directly after it:

```astro
      <InteractiveDesk client:load />
      <QuizGame client:load />
```

- [ ] **Step 3: Typecheck and Astro-check**

Run: `npx tsc --noEmit -p tsconfig.json`
Expected: no output (no errors).

Run: `pnpm astro check`
Expected: `0 errors` in the summary (existing unrelated hints/warnings in the project, if any, are fine — only new errors matter).

- [ ] **Step 4: Full manual verification**

Run: `pnpm dev`, open `/a-propos` in a browser.

1. Scroll down past the interactive desk — confirm the quiz form now appears there permanently (no manual edit needed this time).
2. Repeat the full flow from Task 3 Step 3 (mixed answers, submit, modal shows score + missed list, overlay-click and "Recommencer" both reset).
3. Confirm the rest of the à-propos page (bio, interactive desk) still renders and behaves as before — this change is additive only.

Stop the dev server.

- [ ] **Step 5: Commit**

```bash
git add src/pages/a-propos.astro
git commit -m "feat: mount the desk quiz game on the à-propos page"
```

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { QUIZ_QUESTIONS, type QuizDifficulty } from "../data/quiz-questions";
import { isFuzzyAnswerMatch, normalizeAnswer } from "../utils/normalizeAnswer";

interface QuizResult {
  score: number;
  missed: { id: string; question: string }[];
}

const DIFFICULTY_SECTIONS: { difficulty: QuizDifficulty; label: string }[] = [
  { difficulty: "easy", label: "Echauffement..." },
  { difficulty: "medium", label: "Un peu sérieux..." },
  { difficulty: "difficult", label: "Là on discute !" },
  { difficulty: "GOD LEVEL", label: "🚨 GOAT RESTRICTED AREA 🚨" },
];

const DIFFICULTY_BACKGROUND: Record<QuizDifficulty, string> = {
  easy: "bg-success/10",
  medium: "bg-info/10",
  difficult: "bg-warning/10",
  "GOD LEVEL": "bg-danger/10",
};
const DIFFICULTY_BACKGROUND_LOCKED: Record<QuizDifficulty, string> = {
  easy: "bg-success/50",
  medium: "bg-info/50",
  difficult: "bg-warning/50",
  "GOD LEVEL": "bg-danger/50",
};
const DIFFICULTY_FOREGROUND: Record<QuizDifficulty, string> = {
  easy: "text-success-contrast",
  medium: "text-info-contrast",
  difficult: "text-warning-contrast",
  "GOD LEVEL": "text-danger-contrast",
};

export default function QuizGame() {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<QuizResult | null>(null);
  const [lockedIds, setLockedIds] = useState<Set<string>>(new Set());
  const [errorIds, setErrorIds] = useState<Set<string>>(new Set());

  const handleChange = (id: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
    setErrorIds((prev) => {
      if (!prev.has(id)) return prev;
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let score = 0;
    const missed: { id: string; question: string }[] = [];
    const newlyLocked = new Set(lockedIds);
    const newErrorIds = new Set<string>();
    for (const q of QUIZ_QUESTIONS) {
      const given = normalizeAnswer(answers[q.id] ?? "");
      const isCorrect =
        given.length > 0 &&
        q.acceptedAnswers.some((a) =>
          isFuzzyAnswerMatch(given, normalizeAnswer(a)),
        );
      if (isCorrect) {
        score += 1;
        newlyLocked.add(q.id);
      } else {
        missed.push({ id: q.id, question: q.question });
        newErrorIds.add(q.id);
      }
    }
    setLockedIds(newlyLocked);
    setErrorIds(newErrorIds);
    setResult({ score, missed });
  };

  const dialogRef = useRef<HTMLDivElement>(null);
  const submitButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (result) {
      dialogRef.current?.focus();
    }
  }, [result]);

  const handleClose = () => {
    setResult(null);
    submitButtonRef.current?.focus();
  };

  const handleRestart = () => {
    setAnswers((prev) => {
      const next: Record<string, string> = {};
      for (const id of lockedIds) {
        next[id] = prev[id] ?? "";
      }
      return next;
    });
    setErrorIds(new Set());
    setResult(null);
    submitButtonRef.current?.focus();
  };

  return (
    <details className="group bg-neutral-light mx-auto mt-16 w-full max-w-3xl rounded-2xl p-6 shadow-lg sm:p-8">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 [&::-webkit-details-marker]:hidden">
        <h2 className="font-caveat text-primary-contrast text-4xl font-bold">
          Vous aimez les énigmes ?
        </h2>
        <span className="inline-block text-2xl transition-transform duration-200 group-open:rotate-180">
          ▼
        </span>
      </summary>
      <p className="font-caveat text-primary-contrast mt-4 mb-5 text-2xl font-bold">
        20 petites énigmes dont chaque réponse a un rapport de près ou de loin
        avec un objet cliquable de l'image...
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-8">
        {DIFFICULTY_SECTIONS.map(({ difficulty, label }) => {
          const questions = QUIZ_QUESTIONS.filter(
            (q) => q.difficulty === difficulty,
          );
          if (questions.length === 0) return null;
          return (
            <fieldset key={difficulty} className="flex flex-col gap-4">
              <legend
                className={`${DIFFICULTY_FOREGROUND[difficulty]} font-caveat mb-2 text-3xl font-bold`}
              >
                {label}
              </legend>
              {questions.map((q) => {
                const isLocked = lockedIds.has(q.id);
                const hasError = errorIds.has(q.id);
                const errorId = `quiz-${q.id}-error`;
                return (
                  <div
                    key={q.id}
                    className={`flex flex-col gap-1 rounded-lg p-3 ${isLocked ? DIFFICULTY_BACKGROUND_LOCKED[q.difficulty] : DIFFICULTY_BACKGROUND[q.difficulty]}`}
                  >
                    <label
                      htmlFor={`quiz-${q.id}`}
                      className={`${DIFFICULTY_FOREGROUND[q.difficulty]} font-caveat text-xl font-bold`}
                    >
                      {q.question}
                    </label>
                    <input
                      id={`quiz-${q.id}`}
                      type="text"
                      value={answers[q.id] ?? ""}
                      onChange={(e) => handleChange(q.id, e.target.value)}
                      readOnly={isLocked}
                      aria-invalid={hasError}
                      aria-describedby={hasError ? errorId : undefined}
                      className={
                        isLocked
                          ? "border-border bg-primary/10 text-offblack rounded-lg border px-3 py-2 text-sm"
                          : hasError
                            ? "bg-offwhite text-offblack rounded-lg border border-red-500 px-3 py-2 text-sm"
                            : "border-border bg-offwhite text-offblack rounded-lg border px-3 py-2 text-sm"
                      }
                    />
                    {hasError && (
                      <p id={errorId} className="text-sm text-red-600">
                        Réponse incorrecte
                      </p>
                    )}
                    {isLocked && (
                      <div className="text-offblack mt-1 text-sm">
                        <p className="font-semibold">{q.answer}</p>
                        <p className="opacity-80">{q.funFact}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </fieldset>
          );
        })}
        <button
          ref={submitButtonRef}
          type="submit"
          className="bg-primary hover:bg-primary-dark self-start rounded-xl px-6 py-2 text-sm font-semibold text-white transition-colors"
        >
          Valider mes réponses
        </button>
      </form>
      {result &&
        createPortal(
          <div
            className="fixed inset-0 z-100 flex items-center justify-center bg-black/50 p-4"
            onClick={handleClose}
          >
            <div
              ref={dialogRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="quiz-result-title"
              tabIndex={-1}
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  handleClose();
                }
              }}
              className="bg-background-card text-foreground-card relative max-h-[80vh] w-full max-w-md overflow-y-auto rounded-2xl p-6 shadow-xl"
            >
              <button
                type="button"
                onClick={handleClose}
                aria-label="Fermer"
                className="text-foreground-card/60 hover:text-foreground-card absolute top-4 right-4 text-xl leading-none"
              >
                ×
              </button>
              <h2 id="quiz-result-title" className="text-xl font-bold">
                Score : {result.score}/{QUIZ_QUESTIONS.length}
              </h2>
              {result.missed.length > 0 && (
                <>
                  <p className="mt-4 text-sm font-medium">Questions ratées :</p>
                  <ul className="mt-2 list-disc pl-5 text-sm">
                    {result.missed.map((m) => (
                      <li key={m.id}>{m.question}</li>
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
          </div>,
          document.body,
        )}
    </details>
  );
}

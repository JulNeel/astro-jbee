import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import pereFourasUrl from "@images/pere_fouras.png?url";
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

const POINTS_BY_DIFFICULTY: Record<QuizDifficulty, number> = {
  easy: 2,
  medium: 4,
  difficult: 5,
  "GOD LEVEL": 6,
};

const MAX_SCORE = QUIZ_QUESTIONS.reduce(
  (total, q) => total + POINTS_BY_DIFFICULTY[q.difficulty],
  0,
);

function getScoreComment(score: number, maxScore: number): string {
  const ratio = score / maxScore;
  if (ratio === 1) return "Sans faute ! Le Père Fouras n'a plus rien à vous apprendre. 🏆";
  if (ratio >= 0.75) return "Très solide ! Vous auriez toute votre place dans la salle du trésor.";
  if (ratio >= 0.5) return "Pas mal du tout ! Encore un effort pour décrocher les clés.";
  if (ratio >= 0.25) return "Il y a de l'idée, mais Fouras garde ses clés pour l'instant.";
  return "Aïe aïe aïe... il va falloir retourner explorer l'image !";
}

export default function QuizGame() {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<QuizResult | null>(null);
  const [lockedIds, setLockedIds] = useState<Set<string>>(new Set());
  const [errorIds, setErrorIds] = useState<Set<string>>(new Set());
  const [revealedIds, setRevealedIds] = useState<Set<string>>(new Set());

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
        score += POINTS_BY_DIFFICULTY[q.difficulty];
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

  const handleShowAnswers = () => {
    if (!result) return;
    setRevealedIds((prev) => {
      const next = new Set(prev);
      for (const m of result.missed) next.add(m.id);
      return next;
    });
    setResult(null);
    submitButtonRef.current?.focus();
  };

  return (
    <details className="group bg-background-card mx-auto mt-16 w-full max-w-3xl rounded-2xl p-2 shadow-lg sm:p-2">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 [&::-webkit-details-marker]:hidden">
        <div className="flex items-center gap-3">
          <img src={pereFourasUrl} alt="" className="h-24 w-auto shrink-0" />
          <h2 className="font-caveat text-foreground-card text-4xl font-bold">
            Et si vous aimez les énigmes...
          </h2>
        </div>

        <span className="text-foreground-card inline-block text-2xl transition-transform duration-200 group-open:rotate-180">
          ▼
        </span>
      </summary>
      <p className="font-caveat text-foreground-card mt-4 mb-5 text-2xl font-bold">
        10 petites énigmes dont chaque réponse a un rapport de près ou de loin
        avec l'un des objets cliquables...
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-8">
        {DIFFICULTY_SECTIONS.map(({ difficulty, label }) => {
          const questions = QUIZ_QUESTIONS.filter(
            (q) => q.difficulty === difficulty,
          );
          if (questions.length === 0) return null;
          return (
            <fieldset key={difficulty} className="flex flex-col gap-4">
              <legend className="text-foreground-card font-caveat mb-2 text-3xl font-bold">
                {label}
              </legend>
              {questions.map((q) => {
                const isLocked = lockedIds.has(q.id);
                const isRevealed = revealedIds.has(q.id);
                const showAnswer = isLocked || isRevealed;
                const hasError = errorIds.has(q.id);
                const isMissing =
                  hasError && (answers[q.id] ?? "").trim() === "";
                const isWrong = hasError && !isMissing;
                const errorId = `quiz-${q.id}-error`;
                return (
                  <div
                    key={q.id}
                    className={`flex flex-col gap-1 rounded-lg p-3 ${
                      isLocked
                        ? "bg-success/40"
                        : isWrong
                          ? "bg-danger/40"
                          : "bg-neutral-light"
                    }`}
                  >
                    <label
                      htmlFor={`quiz-${q.id}`}
                      className="text-primary-dark font-caveat text-xl font-bold"
                    >
                      {q.question}
                    </label>
                    <input
                      id={`quiz-${q.id}`}
                      type="text"
                      value={answers[q.id] ?? ""}
                      onChange={(e) => handleChange(q.id, e.target.value)}
                      readOnly={showAnswer}
                      aria-invalid={hasError}
                      aria-describedby={hasError ? errorId : undefined}
                      className={
                        isWrong
                          ? "bg-offwhite text-offblack rounded-lg border border-red-500 px-3 py-2 text-sm"
                          : showAnswer
                            ? "border-border bg-primary/10 text-offblack rounded-lg border px-3 py-2 text-sm"
                            : "border-border bg-offwhite text-offblack rounded-lg border px-3 py-2 text-sm"
                      }
                    />
                    {isWrong && (
                      <p id={errorId} className="text-sm text-red-600">
                        Réponse incorrecte
                      </p>
                    )}
                    {isMissing && (
                      <p id={errorId} className="text-offblack/60 text-sm">
                        Pas de réponse
                      </p>
                    )}
                    {showAnswer && (
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
          className="bg-primary hover:bg-primary-dark sticky bottom-4 z-10 w-full rounded-xl px-6 py-4 text-sm font-semibold text-white shadow-lg transition-colors"
        >
          Vérifier mes réponses
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
                Score : {result.score}/{MAX_SCORE}
              </h2>
              <p className="mt-4 text-sm">
                {getScoreComment(result.score, MAX_SCORE)}
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                {result.missed.length > 0 && (
                  <button
                    type="button"
                    onClick={handleShowAnswers}
                    className="bg-secondary hover:bg-secondary-dark text-secondary-contrast rounded-xl px-6 py-2 text-sm font-semibold transition-colors"
                  >
                    Voir les réponses
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleClose}
                  className="bg-primary hover:bg-primary-dark rounded-xl px-6 py-2 text-sm font-semibold text-white transition-colors"
                >
                  Poursuivre
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </details>
  );
}

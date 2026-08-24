import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { QUIZ_QUESTIONS } from "../data/quiz-questions";
import { normalizeAnswer } from "../utils/normalizeAnswer";

interface QuizResult {
  score: number;
  missed: { id: string; question: string }[];
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
    const missed: { id: string; question: string }[] = [];
    for (const q of QUIZ_QUESTIONS) {
      const given = normalizeAnswer(answers[q.id] ?? "");
      const isCorrect =
        given.length > 0 &&
        q.acceptedAnswers.some((a) => normalizeAnswer(a) === given);
      if (isCorrect) {
        score += 1;
      } else {
        missed.push({ id: q.id, question: q.question });
      }
    }
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
    setAnswers({});
    setResult(null);
    submitButtonRef.current?.focus();
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
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
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
                className="text-foreground-card/60 hover:text-foreground-card absolute right-4 top-4 text-xl leading-none"
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
    </div>
  );
}

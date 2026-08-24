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

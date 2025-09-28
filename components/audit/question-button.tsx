"use client"

import { Button } from "@/components/ui/button"
import { ratingEmojis } from "@/lib/audit-questions"

interface QuestionButtonProps {
  question: string
  type: "rating" | "yesno"
  answers: Record<string, any>
  setAnswers: (answers: Record<string, any>) => void
}

const ratingColors: Record<number, string> = {
  1: "bg-red-600 text-white",        // Strong negative
  2: "bg-red-300 text-black",        // Light red
  3: "bg-green-300 text-black",      // Light green
  4: "bg-green-600 text-white",      // Strong positive
}

export function QuestionButton({ question, type, answers, setAnswers }: QuestionButtonProps) {
  const currentAnswer = answers[question]

  if (type === "rating") {
    return (
      <div className="flex gap-2 flex-wrap">
        {[1, 2, 3, 4].map((rating) => (
          <Button
            key={rating}
            size="sm"
            onClick={() => setAnswers({ ...answers, [question]: rating })}
            className={`flex items-center justify-center text-lg px-4 py-2 rounded-lg
              ${ratingColors[rating]}
              ${currentAnswer === rating ? "ring-4 ring-offset-2 ring-primary" : ""}`}
          >
            {ratingEmojis[rating as keyof typeof ratingEmojis].emoji}
          </Button>
        ))}
      </div>
    )
  }

  return (
    <div className="flex gap-2">
      <Button
        variant={currentAnswer === true ? "default" : "outline"}
        size="sm"
        onClick={() => setAnswers({ ...answers, [question]: true })}
        className={currentAnswer === true ? "bg-green-600 hover:bg-green-700 text-white" : ""}
      >
        Oui
      </Button>
      <Button
        variant={currentAnswer === false ? "default" : "outline"}
        size="sm"
        onClick={() => setAnswers({ ...answers, [question]: false })}
        className={currentAnswer === false ? "bg-red-600 hover:bg-red-700 text-white" : ""}
      >
        Non
      </Button>
    </div>
  )
}

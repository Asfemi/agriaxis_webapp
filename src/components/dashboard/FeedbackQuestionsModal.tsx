import { useEffect, useState } from "react";
import { MessageSquareQuote, Loader2, CheckCircle2 } from "lucide-react";
import { useGetQuestions, useProvideAnswer } from "@/api/feedback";
import type { FeedbackTag } from "@/api/feedback";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface FeedbackQuestionsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tag?: FeedbackTag;
}

export function FeedbackQuestionsModal({
  open,
  onOpenChange,
  tag = "general",
}: FeedbackQuestionsModalProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const { data: questions = [], isLoading } = useGetQuestions(tag);
  const { mutate, isPending } = useProvideAnswer();
  useEffect(() => {
    if (!open) {
      setAnswers({});
      setSubmitted(false);
    }
  }, [open]);

  const handleChange = (questionId: string, value: string) => {
    setAnswers((current) => ({ ...current, [questionId]: value }));
  };

  const handleSubmit = () => {
    const payload = Object.entries(answers).map(([questionId, answer]) => ({
      feedback_question_id: questionId,
      answer,
      tag,
    }));

    mutate(
      { answers: payload },
      {
        onSuccess: () => {
          setSubmitted(true);
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[80vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquareQuote className="h-5 w-5 text-green-600" />
            Feedback and questions
          </DialogTitle>
          <DialogDescription>
            Share a few quick answers so we can improve your experience.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-8 text-sm text-gray-500">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Loading questions...
          </div>
        ) : submitted ? (
          <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700">
            <div className="flex items-center gap-2 font-medium">
              <CheckCircle2 className="h-4 w-4" />
              Thanks for sharing your feedback.
            </div>
          </div>
        ) : questions.length === 0 ? (
          <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-600">
            <p className="font-medium text-slate-700">No feedback questions available yet.</p>
            <p className="mt-1">There are no questions for this feature right now. Please check back later.</p>
          </div>
        ) : (
          <div className="space-y-5">
            {questions.map((question) => (
              <div key={question.id} className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  {question.question_text}
                </label>

                {question.type === "choice" && question.options?.length ? (
                  <div className="flex flex-wrap gap-2">
                    {question.options.map((option) => (
                      <button
                        key={option}
                        type="button"
                        className={`rounded-full border px-3 py-2 text-sm transition ${
                          answers[question.id] === option
                            ? "border-green-600 bg-green-50 text-green-700"
                            : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                        }`}
                        onClick={() => handleChange(question.id, option)}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                ) : (
                  <textarea
                    value={answers[question.id] ?? ""}
                    onChange={(event) =>
                      handleChange(question.id, event.target.value)
                    }
                    className="min-h-24 w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-green-500"
                    placeholder="Type your answer..."
                  />
                )}
              </div>
            ))}
          </div>
        )}

        {!submitted && (
          <DialogFooter className="sm:justify-end">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isPending || questions.length === 0}
              className="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isPending ? "Submitting..." : "Submit feedback"}
            </button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}

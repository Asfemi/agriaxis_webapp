export type Question = {
  id: string;
  question_text: string;
  type: "choice" | "text";
  tag: string;
  options: string[] | null;
  sort_order: number;
};

type Answer = {
  feedback_question_id: string;
  answer: string;
  tag: string;
};

export type ProvideAnswerRequest = {
  answers: Answer[];
};

export type ProvideAnswerResponse = {
  saved_count: number;
  message: string;
};

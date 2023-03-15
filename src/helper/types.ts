export type AnswerType = {
    id: number,
    answer: string
    correct?: boolean
}

export type QuestionType = {
    id: number,
    question: string,
    answers: AnswerType[]
}
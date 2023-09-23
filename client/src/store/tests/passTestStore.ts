import {create} from "zustand";

export interface QuestionAnswer {
    questionNumber: number
    isPassed: boolean
}

export interface PassTest {
    answers: QuestionAnswer[],
    addAnswer: (questionAnswer: QuestionAnswer) => void,
}

export const usePassTestStore = create<PassTest>((set: any, get: any) => ({
    answers: [],
    addAnswer: (questionAnswer: QuestionAnswer) => {
        set({answers: [...get().answers, questionAnswer]});
        console.log(get().answers)
    }
}))


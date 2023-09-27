import {create} from "zustand";
import {AnswerOption, UserTest} from "./testStore";

export interface TestResult {
    testTitle: string,
    questionAnswers: QuestionAnswer[]
}

export interface QuestionAnswer {
    questionNumber: number
    isPassed: boolean
}

export interface PassTest {
    testResults: TestResult[],
    saveTestResult: (testName: string) => void,
    testIdsToPass: number[],
    setTestIdsToPass: (selectedTestIdsToPass: number[]) => void,
    testToPass: UserTest[],
    setTestsToPass: (selectedTestsToPass: UserTest[]) => void,
    answers: QuestionAnswer[],
    addAnswer: (questionAnswer: QuestionAnswer) => void,
    // selectedOptions: AnswerOption[],
    selectedOptionIds: number[],
    setSelectedOptionIds: (selectedOptionIds: number[]) => void;
    // setSelectedOptions: (selectedOptions: AnswerOption[]) => void;
}

export const usePassTestStore = create<PassTest>((set: any, get: any) => ({
    testResults: [],
    testIdsToPass: [],
    testToPass: [],
    selectedOptionIds: [],
    setSelectedOptionIds: (selectedOptionIds: number[]) => {
        set({selectedOptions: selectedOptionIds})
    },
    saveTestResult: (title: string) => {
        let testResult: TestResult = {
            testTitle: title,
            questionAnswers: get().answers
        }
        set({
            testResults: [...get().testResults, testResult],
            answers: []
        })

    },
    setTestsToPass: (selectedTestsToPass: UserTest[]) => {
        set({testToPass: selectedTestsToPass})
    },
    setTestIdsToPass: (selectedTestsToPass: number[]) => {
        set({testIdsToPass: selectedTestsToPass})
        console.log(get().testIdsToPass);
    },
    answers: [],
    addAnswer: (questionAnswer: QuestionAnswer) => {
        set({answers: [...get().answers, questionAnswer]});
    }
}))


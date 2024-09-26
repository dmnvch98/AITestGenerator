import {create} from "zustand";
import {UserTest} from "./testStore";
import TestResultService from "../../services/TestResultService";

export interface TestResult {
    id: number | undefined,
    testPassedTime: Date | undefined
    testTitle: string,
    testId: number | undefined,
    questionAnswers: QuestionAnswer[]
}

export interface QuestionAnswer {
    questionNumber: number
    passed: boolean
}

export interface PassTest {
    testResults: TestResult[],
    saveTestResult: (testName: string, testId: number) => void,
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
    singleTestResult: TestResult | undefined;
    getSingleTestResult: (testId: number, resultId: number) => void;
    getAllUserTestResults: () => void;
}

export const usePassTestStore = create<PassTest>((set: any, get: any) => ({
    testResults: [],
    testIdsToPass: [],
    testToPass: [],
    selectedOptionIds: [],
    setSelectedOptionIds: (selectedOptionIds: number[]) => {
        set({selectedOptions: selectedOptionIds})
    },
    saveTestResult: (title: string, testId: number) => {
        let testResult: TestResult = {
            id: undefined,
            testPassedTime: undefined,
            testId: undefined,
            testTitle: title,
            questionAnswers: get().answers
        }
        TestResultService.saveTestResult(testResult, testId).then(
            r => {
                set({
                    testResults: [...get().testResults, r],
                    answers: []
                })
            }
        );
    },
    setTestsToPass: (selectedTestsToPass: UserTest[]) => {
        set({testToPass: selectedTestsToPass})
    },
    setTestIdsToPass: (selectedTestsToPass: number[]) => {
        set({testIdsToPass: selectedTestsToPass})
    },
    answers: [],
    addAnswer: (questionAnswer: QuestionAnswer) => {
        set({answers: [...get().answers, questionAnswer]});
    },
    singleTestResult: undefined,
    getSingleTestResult: async (testId: number, resultId: number) => {
        const result: TestResult = await TestResultService.getSingleTestResult(testId, resultId);
        set({singleTestResult: result})
    },
    getAllUserTestResults: async () => {
        const result: TestResult[] = await TestResultService.getAllUserTestResults();
        set({ testResults: result})
    }
}))


import {create} from "zustand";
import TestService from "../../services/TestService";

export interface UserTest {
    id: number,
    textId: number,
    title: string,
    questions: Question[]
}

export interface Question {
    id: number,
    questionText: string,
    answerOptions: AnswerOption[]
}

export interface AnswerOption {
    id: number,
    optionText: string,
    isCorrect: boolean
}

export interface GenerateTestRequestDto {
    textId: number,
    minQuestionNumber: number | undefined,
    maxQuestionNumber: number | undefined
}

export interface TestStore {
    tests: UserTest[],
    selectedTest: UserTest | undefined,
    selectTest: (userTest: UserTest) => void,
    testDeletedFlag: boolean,
    toggleTestDeletedFlag: () => void,
    generateTest: (textId: number) => void,
    getAllUserTests: () => void,
    getUserTestsByIdIn: (ids: number[]) => Promise<void>,
    deleteTest: (ids: number) => void,
    generateTestFlag: boolean,
    toggleGenerateTestFlag: () => void,
    maxQuestionsNumber: number | string,
    setMaxQuestionsNumber: (questionsNumber: number) => void;
    generateTestValidationErrorFlag: boolean;
    setGenerateTestValidationErrorFlag: (flag: boolean) => void;

}

export const useTestStore = create<TestStore>((set: any, get: any) => ({
    tests: [],
    selectedTest: undefined,
    generateTestFlag: true,
    maxQuestionsNumber: "",
    generateTestValidationErrorFlag: false,
    selectTest: (userTest: UserTest) => {
        set({selectedTest: userTest})
    },
    testDeletedFlag: false,
    generateTest: async (textId: number) => {
        let dto: GenerateTestRequestDto = {
            textId: textId,
            minQuestionNumber: get().minQuestionsNumber,
            maxQuestionNumber: get().maxQuestionsNumber
        }
        await TestService.generateTest(dto);
    },
    toggleTestDeletedFlag: () => {
        set({testDeletedFlag: !get().testDeletedFlag})
    },
    getAllUserTests: async () => {
        const response = await TestService.getUserTests()
        set({tests: response})
    },
    deleteTest: async (id: number) => {
        const response = await TestService.deleteTest(id);
        if (response) {
            get().getAllUserTests();
            set({testDeletedFlag: true})
        }
    },
    getUserTestsByIdIn: async (ids: number[]) => {
        const userTests = await TestService.getUserTests(ids)
        set({tests: userTests});
    },
    toggleGenerateTestFlag: () => {
        set({generateTestFlag: !get().generateTestFlag})
    },
    setMaxQuestionsNumber: (questionsNumber: number) => {
        set({maxQuestionsNumber: questionsNumber})
    },
    setGenerateTestValidationErrorFlag: (flag: boolean) => {
        set({generateTestValidationErrorFlag: flag})
    }
}))
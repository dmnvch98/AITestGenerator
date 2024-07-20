import {create} from "zustand";
import TestService from "../../services/TestService";
import {AlertMessage} from "../types";
import {FileDto} from "../fileStore";

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
    textId: number
}

export interface TestStore {
    tests: UserTest[],
    selectedTest: UserTest | undefined,
    selectTest: (userTest: UserTest) => void,
    deleteTestFlag: boolean,
    setDeleteTestFlag: (flag: boolean) => void,
    generateTest: (textId: number) => void,
    generateTestByFile: (hashedFileName: string) => Promise<boolean>,
    getAllUserTests: () => void,
    getUserTestsByIdIn: (ids: number[]) => Promise<void>,
    deleteTest: (ids: number) => void,
    generateTestFlag: boolean,
    toggleGenerateTestFlag: () => void,
    maxQuestionsNumber: number | string,
    setMaxQuestionsNumber: (questionsNumber: number) => void;
    generateTestValidationErrorFlag: boolean;
    setGenerateTestValidationErrorFlag: (flag: boolean) => void;
    selectedTextId: number | undefined,
    setSelectedTextId: (id: number) => void;
    testGenerationStarted: boolean;
    setTestGenerationStarted: (flag: boolean) => void;
    alerts: AlertMessage[],
    setAlert: (alert: AlertMessage[]) => void;
    clearAlerts: () => void;
    deleteAlert: (alert: AlertMessage) => void;
}

export const useTestStore = create<TestStore>((set, get) => ({
    tests: [],
    selectedTest: undefined,
    generateTestFlag: false,
    maxQuestionsNumber: "",
    generateTestValidationErrorFlag: false,
    selectedTextId: undefined,
    alerts: [],
    selectTest: (userTest: UserTest) => {
        set({selectedTest: userTest})
    },
    generateTest: async (textId: number) => {
        let dto: GenerateTestRequestDto = {
            textId: textId
        }
        const response = await TestService.generateTest(dto);
        if (response) {
            set({testGenerationStarted: true})
        }
    },

    generateTestByFile: async (hashedFileName) => {
        const response = await TestService.generateTestByFile(hashedFileName);
        return response as boolean;
    },
    getAllUserTests: async () => {
        const response = await TestService.getUserTests()
        set({tests: response})
    },
    deleteTest: async (id: number) => {
        const response = await TestService.deleteTest(id);
        if (response) {
            const { setAlert, getAllUserTests } = get();
            getAllUserTests();
            setAlert([{ id: Date.now(), message: 'Тест успешно удален', severity: 'success' }])
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
    },
    setSelectedTextId: (id: number) => {
        set({selectedTextId: id})
    },
    testGenerationStarted: false,
    setTestGenerationStarted: (flag: boolean) => {
        set({testGenerationStarted: flag})
    },
    deleteTestFlag: false,
    setDeleteTestFlag: (flag: boolean) => {
        set({deleteTestFlag: flag});
    },
    setAlert: (alerts) => set((state) => ({alerts: [...state.alerts, ...alerts]})),
    clearAlerts: () => set({alerts: []}),
    deleteAlert: (alertToDelete) => set((state) => ({
        alerts: state.alerts.filter(alert => alert.id !== alertToDelete.id)
    })),
}))

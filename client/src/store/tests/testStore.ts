import {create} from "zustand";
import TestService from "../../services/TestService";
import {AlertMessage} from "../types";

export interface UserTest {
    id: number,
    textId: number | undefined,
    title: string,
    questions: Question[]
}

export interface Question {
    id: number | undefined,
    questionText: string,
    answerOptions: AnswerOption[]
}

export interface AnswerOption {
    id: number | undefined,
    optionText: string,
    isCorrect: boolean
}

export interface GenerateTestRequestDto {
    textId: number
}

export interface GenerateTestRequest {
    maxQuestionsCount: number,
    minAnswersCount: number,
    temperature: number,
    topP: number,
    hashedFileName: string
}

export interface TestStore {
    tests: UserTest[],
    selectedTest: UserTest | undefined,
    selectTest: (userTest: UserTest) => void,
    clearSelectedTest: () => void,
    deleteTestFlag: boolean,
    setDeleteTestFlag: (flag: boolean) => void,
    generateTest: (textId: number) => void,
    generateTestByFile: (request: GenerateTestRequest) => Promise<boolean>,
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
    updateTest: (test: UserTest) => void;
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
        userTest.questions.sort((a, b) => Number(a.id) > Number(b.id) ? 1 : -1);
        set({selectedTest: userTest});
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

    generateTestByFile: async (request) => {
        const response = await TestService.generateTestByFile(request);
        return response as boolean;
    },
    getAllUserTests: async () => {
        const response = await TestService.getUserTests()
        set({tests: response})
    },
    deleteTest: async (id: number) => {
        const response = await TestService.deleteTest(id);
        const { setAlert, getAllUserTests } = get();
        if (response) {
            getAllUserTests();
            setAlert([{ id: Date.now(), message: 'Тест успешно удален', severity: 'success' }])
        } else {
            setAlert([{ id: Date.now(), message: 'Произошла ошибка при удалении теста', severity: 'error' }])
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
    updateTest: async (test) => {
        const { setAlert, getAllUserTests } = get();
        const response = await TestService.updateTest(test);
        if (response) {
            getAllUserTests();
            setAlert([{ id: Date.now(), message: 'Тест успешно обновлен', severity: 'success' }])
        } else {
            setAlert([{ id: Date.now(), message: 'Произошла ошибка при обновлении теста', severity: 'error' }])
        }
    },
    clearSelectedTest: () => {
        set({selectedTest: undefined});
    }
}))

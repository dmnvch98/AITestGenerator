import {create} from "zustand";
import TestService from "../../services/TestService";
import {AlertMessage} from "../types";
import TestRatingService from "../../services/TestRatingService";

export interface UserTest {
    id: number;
    title: string;
    questions: Question[];
    rating?: number;
    fileName: string;
}

export interface CreateTestRequestDto {
    title: string,
    questions: Question[]
}

export interface Question {
    id?: string,
    questionText: string,
    answerOptions: AnswerOption[]
}

export interface AnswerOption {
    id?: string,
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

export interface BulkDeleteTestsRequestDto {
    ids: number[];
}

export interface TestRatingDto {
    rating: number;
    feedback?: string;
}

export interface TestStore {
    tests: UserTest[],
    selectedTest: UserTest | undefined,
    selectedTestRating: TestRatingDto | undefined;
    selectTest: (userTest: UserTest) => void,
    clearSelectedTest: () => void,
    deleteTestFlag: boolean,
    setDeleteTestFlag: (flag: boolean) => void,
    generateTest: (textId: number) => void,
    generateTestByFile: (request: GenerateTestRequest) => Promise<boolean>,
    getAllUserTests: () => void,
    getUserTestsByIdIn: (ids: number[]) => Promise<void>,
    getUserTestById: (id: number) => Promise<UserTest>,
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
    upsert: (test: UserTest | CreateTestRequestDto) => Promise<UserTest | null>;
    saveTest: (test: CreateTestRequestDto) => void;
    bulkDeleteTest: (request: BulkDeleteTestsRequestDto) => void;
    updateRating: (id: number, request: TestRatingDto) => void;
    getRating: (id: number) => void;
}

export const useTestStore = create<TestStore>((set, get) => ({
    tests: [],
    selectedTest: undefined,
    selectedTestRating: undefined,
    generateTestFlag: false,
    maxQuestionsNumber: "",
    generateTestValidationErrorFlag: false,
    selectedTextId: undefined,
    alerts: [],
    selectTest: (userTest: UserTest) => {
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
        const {tests} = await TestService.getUserTests()
        set({tests: tests})
    },
    deleteTest: async (id: number) => {
        const response = await TestService.deleteTest(id);
        const { setAlert, getAllUserTests } = get();
        if (response) {
            getAllUserTests();
            setAlert([{ id: Date.now(), message: 'Тест успешно удален', severity: 'success' }]);
        } else {
            setAlert([{ id: Date.now(), message: 'Произошла ошибка при удалении теста', severity: 'error' }]);
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
    upsert: async (test): Promise<UserTest | null> => {
        const { setAlert, getAllUserTests} = get();
        const response = await TestService.upsert(test);
        if (response) {
            getAllUserTests();
            setAlert([{ id: Date.now(), message: 'Тест успешно обновлен', severity: 'success' }])
            return response as UserTest;
        } else {
            setAlert([{ id: Date.now(), message: 'Произошла ошибка при обновлении теста', severity: 'error' }])
            return null;
        }
    },
    clearSelectedTest: () => {
        set({selectedTest: undefined});
    },
    getUserTestById: async (id) => {
        const response = await TestService.getUserTestById(id);
        set({selectedTest: response});
        return response;
    },
    saveTest: async (test) => {
        const { setAlert} = get();
        const response = await TestService.saveUserTest(test);
        if (response) {
            setAlert([{ id: Date.now(), message: 'Тест успешно сохранен', severity: 'success' }])
        } else {
            setAlert([{ id: Date.now(), message: 'Произошла ошибка при сохранении теста', severity: 'error' }])
        }
    },
    bulkDeleteTest: async (request) => {
        const response = await TestService.bulkTestDelete(request);
        const { setAlert, getAllUserTests } = get();
        if (response) {
            getAllUserTests();
            setAlert([{ id: Date.now(), message: 'Тесты успешно удалены', severity: 'success' }])
        } else {
            setAlert([{ id: Date.now(), message: 'Произошла ошибка при удалении тестов', severity: 'error' }])
        }
    },
    updateRating: async (id, request) => {
        const response = await TestRatingService.upsert(id, request);
        const { setAlert, selectedTest, selectTest } = get();
        if (response) {
            setAlert([{ id: Date.now(), message: 'Рейтинг успешно обновлен', severity: 'success' }]);
            if (selectedTest) {
                const updatedTest: UserTest = {
                    rating: request.rating,
                    ...selectedTest
                }
                selectTest(updatedTest);
            }
        } else {
            setAlert([{ id: Date.now(), message: 'Произошла ошибка при обновлении рейтинга', severity: 'error' }])
        }
    },
    getRating: async (id) => {
        const rating = await TestRatingService.get(id);
        if (rating) {
            set({selectedTestRating: rating})
        }
    }
}))

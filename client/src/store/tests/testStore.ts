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
    addAlert: (alert: AlertMessage) => void;
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
    addAlert: (alert: AlertMessage) => {
        get().alerts.push(alert);
    },
    deleteTest: async (id: number) => {
        const response = await TestService.deleteTest(id);
        const { addAlert, getAllUserTests } = get();
        if (response) {
            getAllUserTests();
            addAlert(new AlertMessage('Тест успешно удален', 'success'));
        } else {
            addAlert(new AlertMessage('Произошла ошибка при удалении теста', 'error'));
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
        const { addAlert, getAllUserTests} = get();
        const response = await TestService.upsert(test);
        if (response) {
            getAllUserTests();
            addAlert(new AlertMessage('Тест успешно обновлен', 'success'));
            return response as UserTest;
        } else {
            addAlert(new AlertMessage('Произошла ошибка при обновлении теста', 'error'));
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
        const { addAlert } = get();
        const response = await TestService.saveUserTest(test);
        if (response) {
            addAlert(new AlertMessage('Тест успешно обновлен', 'success'));
        } else {
            addAlert(new AlertMessage('Произошла ошибка при сохранении теста', 'error'));
        }
    },
    bulkDeleteTest: async (request) => {
        const response = await TestService.bulkTestDelete(request);
        const { addAlert, getAllUserTests } = get();
        if (response) {
            getAllUserTests();
            addAlert(new AlertMessage('Тесты успешно удалены', 'success'));
        } else {
            addAlert(new AlertMessage('Произошла ошибка при удалении тестов', 'error'));
        }
    },
    updateRating: async (id, request) => {
        const response = await TestRatingService.upsert(id, request);
        const { addAlert, selectedTest, selectTest } = get();
        if (response) {
            addAlert(new AlertMessage('Рейтинг успешно обновлен', 'success'));
            if (selectedTest) {
                const updatedTest: UserTest = {
                    rating: request.rating,
                    ...selectedTest
                }
                selectTest(updatedTest);
            }
        } else {
            addAlert(new AlertMessage('Произошла ошибка при обновлении рейтинга', 'error'));
        }
    },
    getRating: async (id) => {
        const rating = await TestRatingService.get(id);
        if (rating) {
            set({selectedTestRating: rating})
        }
    }
}))

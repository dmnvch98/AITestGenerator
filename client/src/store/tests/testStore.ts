import {create} from "zustand";
import TestService from "../../services/TestService";
import {AlertMessage, QueryOptions} from "../types";
import TestRatingService from "../../services/TestRatingService";
import {useNotificationStore} from "../notificationStore";
import NotificationService from "../../services/notification/NotificationService";
import {GenerateTestRequest} from "./types";

export interface UserTest {
    id: number;
    title: string;
    questions: Question[];
    rating?: number;
    fileName: string;
    createdAt: Date;
}

export interface CreateTestRequestDto {
    title: string,
    questions: Question[]
}

export interface Question {
    id?: string,
    questionText: string,
    answerOptions: AnswerOption[]
    textReference?: string;
}

export interface AnswerOption {
    id?: string,
    optionText: string,
    isCorrect: boolean
}

export interface BulkDeleteTestsRequestDto {
    ids: number[];
}

export interface TestRatingDto {
    rating: number;
    feedback?: string;
}

export interface TestsResponseDto {
    tests: UserTest[];
    totalPages: number;
    totalElements: number;
}

export interface TestPrintRequestDto {
    testId: number;
}

export interface TestStore {
    tests: UserTest[],
    totalPages: number,
    totalElements: number,
    selectedTest: UserTest | undefined,
    selectedTestRating: TestRatingDto | undefined;
    selectTest: (userTest: UserTest) => void,
    clearSelectedTest: () => void,
    deleteTestFlag: boolean,
    setDeleteTestFlag: (flag: boolean) => void,
    generateTestByFile: (request: GenerateTestRequest) => void,
    isGenerateTestByFileQueueing: boolean,
    getAllUserTests: (options?: QueryOptions) => void,
    getUserTestById: (id: number) => Promise<UserTest>,
    deleteTest: (ids: number) => void,
    upsert: (test: UserTest | CreateTestRequestDto) => Promise<UserTest | null>;
    saveTest: (test: CreateTestRequestDto) => void;
    bulkDeleteTest: (request: BulkDeleteTestsRequestDto) => void;
    updateRating: (id: number, request: TestRatingDto) => void;
    getRating: (id: number) => void;
    clearState: () => void;
    printTest: () => void;
}

export const useTestStore = create<TestStore>((set, get) => ({
    tests: [],
    totalPages: 0,
    totalElements: 0,
    selectedTest: undefined,
    selectedTestRating: undefined,
    isGenerateTestByFileQueueing: false,

    clearState: () => {
        set({
            tests: [],
            selectedTest: undefined,
            selectedTestRating: undefined,
        })
    },
    selectTest: (userTest: UserTest) => {
        set({selectedTest: userTest});
    },

    generateTestByFile: async (request) => {
        set({isGenerateTestByFileQueueing: false});
        const alert: AlertMessage = new AlertMessage(
            `Файл <b>${request.originalFileName}</b> отправлен в очередь`,
            'info',
            'progress',
            false
            );
        NotificationService.addAlert(alert);
        const isSuccess = await TestService.generateTestByFile(request);
        NotificationService.deleteAlert(alert);
        if (isSuccess) {
            NotificationService.addAlert(new AlertMessage(`Файл <b>${request.originalFileName}</b> добавлен в очередь`, 'success'));
        } else {
            NotificationService.addAlert(new AlertMessage(`Ошибка при добавлении <b>${request.originalFileName}</b> в очередь. Пожалуйста, попробуйте позже.`, 'error'));
        }
        set({isGenerateTestByFileQueueing: true});
    },
    getAllUserTests: async (options) => {
        const { tests, totalPages, totalElements }: TestsResponseDto = await TestService.getUserTests(options)
        set({ tests, totalPages, totalElements })
    },
    addAlert: (alert: AlertMessage) => {
        useNotificationStore.getState().addAlert(alert);
    },
    deleteTest: async (id: number) => {
        const response = await TestService.deleteTest(id);
        const { getAllUserTests } = get();
        if (response) {
            getAllUserTests();
            NotificationService.addAlert(new AlertMessage('Тест успешно удален', 'success'));
        } else {
            NotificationService.addAlert(new AlertMessage('Произошла ошибка при удалении теста', 'error'));
        }
    },
    deleteTestFlag: false,
    setDeleteTestFlag: (flag: boolean) => {
        set({deleteTestFlag: flag});
    },
    upsert: async (test): Promise<UserTest | null> => {
        const { getAllUserTests} = get();
        const response = await TestService.upsert(test);
        if (response) {
            getAllUserTests();
            NotificationService.addAlert(new AlertMessage('Тест успешно обновлен', 'success'));
            return response as UserTest;
        } else {
            NotificationService.addAlert(new AlertMessage('Произошла ошибка при обновлении теста', 'error'));
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
        const response = await TestService.saveUserTest(test);
        if (response) {
            NotificationService.addAlert(new AlertMessage('Тест успешно обновлен', 'success'));
        } else {
            NotificationService.addAlert(new AlertMessage('Произошла ошибка при сохранении теста', 'error'));
        }
    },
    bulkDeleteTest: async (request) => {
        const response = await TestService.bulkTestDelete(request);
        const { getAllUserTests } = get();
        if (response) {
            getAllUserTests();
            NotificationService.addAlert(new AlertMessage('Тест(ы) успешно удалены', 'success'));
        } else {
            NotificationService.addAlert(new AlertMessage('Произошла ошибка при удалении тестов', 'error'));
        }
    },
    updateRating: async (id, request) => {
        const { success, rating } = await TestRatingService.upsert(id, request);
        if (success) {
            NotificationService.addAlert(new AlertMessage('Рейтинг успешно обновлен', 'success'));
            set({selectedTestRating: rating})
        } else {
            NotificationService.addAlert(new AlertMessage('Произошла ошибка при обновлении рейтинга', 'error'));
        }
    },
    getRating: async (id) => {
        const rating = await TestRatingService.get(id);
        if (rating) {
            set({selectedTestRating: rating})
        }
    },
    printTest: async () => {
        const {selectedTest} = get();
        const testId = selectedTest && selectedTest.id;
        testId && await TestService.printTest({testId});
    }
}))

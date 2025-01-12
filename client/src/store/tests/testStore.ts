import {create} from "zustand";
import TestService from "../../services/TestService";
import {AlertMessage, QueryOptions} from "../types";
import TestRatingService from "../../services/TestRatingService";
import {useNotificationStore} from "../notificationStore";
import NotificationService from "../../services/notification/AlertService";
import {GenerateTestRequest, QuestionType} from "./types";
import {convertTest} from "./converter/testConverter";

export interface UserTest {
    id: number;
    title: string;
    questions: Question[];
    rating?: number;
    fileName: string;
    createdAt: Date;
}

export interface UpsertTestRequestDto {
    id?: number;
    title: string,
    questions: QuestionDto[]
}

export interface QuestionDto {
    questionText: string;
    answerOptions: AnswerOptionDto[]
    questionType: QuestionType;
}

export interface AnswerOptionDto {
    optionText: string;
    correct: boolean;
}

export interface CreateTestRequestDto {
    title: string,
    questions: Question[]
}

export interface Question {
    id: number,
    questionText: string,
    answerOptions: AnswerOption[]
    textReference?: string;
    questionType: QuestionType;
}

export interface AnswerOption {
    id: number,
    optionText: string,
    correct: boolean
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
    //TODO-to delete
    generateTestByFile: (request: GenerateTestRequest) => Promise<boolean>,
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
    isLoading: boolean;
}

export const useTestStore = create<TestStore>((set, get) => ({
    tests: [],
    totalPages: 0,
    totalElements: 0,
    selectedTest: undefined,
    selectedTestRating: undefined,
    isLoading: false,

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

    //TODO-to delete
    generateTestByFile: async (request): Promise<boolean> => {
        return await TestService.generateTestByFile(request);
    },

    getAllUserTests: async (options) => {
        const opt: QueryOptions = {
            sortBy: options?.sortBy || 'id',
            sortDirection: options?.sortDirection || 'desc',
            size: options?.size || 5,
            ...options
        }
        set({isLoading: true});
        const { tests, totalPages, totalElements }: TestsResponseDto = await TestService.getUserTests(opt)
        set({ tests, totalPages, totalElements, isLoading: false })
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
        const dto: UpsertTestRequestDto = convertTest(test);
        const response = await TestService.upsert(dto);
        if (response) {
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

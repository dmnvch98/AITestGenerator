import {create} from "zustand";
import UserService from "../services/UserService";
import {GenerationStatus, User} from "./types";
import TestService from "../services/TestService";

export interface TestGenHistory {
    id: number,
    testTitle: string,
    testId: number,
    textTitle: string,
    textId: number,
    generationStart: Date,
    generationEnd: Date,
    generationStatus: GenerationStatus
    fileName: string
}

export interface UserStore {
    testGenHistoryPast: TestGenHistory[],
    testGenHistoryCurrent: TestGenHistory[],
    getTestGenHistoryCurrent: () => Promise<TestGenHistory[]>,
    setCurrentTestGenHistories: (testGen: TestGenHistory) => void,
    getTestGenHistory: () => void;
    loading: boolean;
    setLoading: (flag: boolean) => void;
    user: User | undefined,
    getMe: () => void,
    getCurrentUser: () => void;
}

export const useUserStore = create<UserStore>((set: any, get: any) => ({
    testGenHistoryPast: [],
    testGenHistoryCurrent: [],
    loading: false,
    user: undefined,
    setLoading: (flag) => {
        set({loading: flag})
    },
    getTestGenHistory: async () => {
        const response = await UserService.getTestGenerationHistory(undefined);
        set({testGenHistoryPast: response})
    },

    getTestGenHistoryCurrent: async (): Promise<TestGenHistory[]> => {
        const response = await TestService.getCurrentTestGenerationHistory();
        set({testGenHistoryCurrent: response})
        return response as TestGenHistory[];
    },
    setCurrentTestGenHistories: (testGen) => {
        const { testGenHistoryCurrent } = get();
        const index = testGenHistoryCurrent.findIndex((obj: { id: number; }) => obj.id === testGen.id);
        let updatedHistory;
        if (index !== -1) {
            updatedHistory = [...testGenHistoryCurrent.slice(0, index), testGen, ...testGenHistoryCurrent.slice(index + 1)];
        } else {
            updatedHistory = [...testGenHistoryCurrent, testGen];
        }
        set({ testGenHistoryCurrent: updatedHistory });
    },

    getMe: async () => {
        const response: User = await UserService.getMe();
        if (response) {
            set({user: response});
            localStorage.setItem("user", JSON.stringify(response));
        }
    },

    getCurrentUser: () => {
        const userString = localStorage.getItem("user");
        let user: User;

        if (userString) {
            try {
                user = JSON.parse(userString) as User;
                set({user: user});
            } catch (error) {
                console.error('Ошибка при парсинге JSON строки:', error);
                throw new Error('Invalid user data in localStorage');
            }
        } else {
            throw new Error('No user data found in localStorage');
        }
    }

}))

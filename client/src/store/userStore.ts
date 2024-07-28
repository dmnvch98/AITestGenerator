import {create} from "zustand";
import UserService from "../services/UserService";
import {GenerationStatus} from "./types";

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
    getTestGenHistoryCurrent: () => void,
    setCurrentTestGenHistories: (testGen: TestGenHistory) => void,
    getTestGenHistory: () => void;
    loading: boolean;
    setLoading: (flag: boolean) => void;
}

export const useUserStore = create<UserStore>((set: any, get: any) => ({
    testGenHistoryPast: [],
    testGenHistoryCurrent: [],
    loading: false,
    setLoading: (flag) => {
        set({loading: flag})
    },
    getTestGenHistory: async () => {
        const response = await UserService.getTestGenerationHistory(undefined);
        set({testGenHistoryPast: response})
    },

    getTestGenHistoryCurrent: async () => {
        const response = await UserService.getTestGenerationHistory(GenerationStatus.IN_PROCESS);
        set({testGenHistoryCurrent: response})
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
    }
}))

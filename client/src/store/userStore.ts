import {create} from "zustand";
import UserService from "../services/UserService";

export interface TestGenHistory {
    id: number,
    testId: number,
    textId: number,
    generationStart: Date,
    generationEnd: Date,
    inputTokensCount: number,
    outputTokensCount: number,
    generationStatus: string
}

export interface UserStore {
    testGenHistory: TestGenHistory[],
    getTestGenHistory: () => void;
}

export const useUserStore = create<UserStore>((set: any, get: any) => ({
    testGenHistory: [],
    getTestGenHistory: async () => {
        const response = await UserService.getTestGenerationHistory();
        set({testGenHistory: response})
    }
}))
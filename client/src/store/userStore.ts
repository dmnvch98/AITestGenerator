import {create} from "zustand";
import UserService from "../services/UserService";

export interface TestGenHistory {
    id: number,
    testTitle: string,
    testId: number,
    textTitle: string,
    textId: number,
    generationStart: Date,
    generationEnd: Date,
    generationStatus: string
    fileName: string
}

export interface UserStore {
    testGenHistory: TestGenHistory[],
    getTestGenHistory: () => void;
}

export const useUserStore = create<UserStore>((set: any) => ({
    testGenHistory: [],
    getTestGenHistory: async () => {
        const response = await UserService.getTestGenerationHistory();
        set({testGenHistory: response})
    }
}))

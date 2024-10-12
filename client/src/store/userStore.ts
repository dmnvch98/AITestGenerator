import {create} from "zustand";
import UserService from "../services/UserService";
import {GenerationStatus} from "./types";
import TestService from "../services/TestService";
import ActivityService from "../services/activities/ActivityService";

export interface TestGenHistory extends ActivityDto {
    id: number,
    testTitle: string,
    testId: number,
    textTitle: string,
    textId: number,
    failCode: number;
    cid: string;
}

export interface ActivityDto {
    uuid: string,
    generationStart: Date,
    generationEnd: Date,
    status: GenerationStatus,
    testId?: number,
    fileName: string,
    testTitle: string,
    failCode: number;
    cid: string;
}

export interface UserStore {
    currentActivities: ActivityDto[];
    testGenHistoryPast: TestGenHistory[],
    getTestGenCurrentActivities: () => void,
    addCurrentActivity: (activity: ActivityDto) => void,
    deleteCurrentActivity: (activity: ActivityDto) => void,
    getTestGenHistory: () => void;
    loading: boolean;
    setLoading: (flag: boolean) => void;
    getTestGenCurrentActivitiesLongPoll: () => void;
    isAuthenticated: boolean,
    setAuthenticated: (authStatus: boolean) => void;
}

export const useUserStore = create<UserStore>((set: any, get: any) => ({
    testGenHistoryPast: [],
    currentActivities: [],
    loading: false,
    user: undefined,
    isAuthenticated: false,
    setAuthenticated: (authStatus: boolean) => {
      set({authStatus: authStatus});
    },
    setLoading: (flag) => {
        set({loading: flag})
    },
    getTestGenHistory: async () => {
        const response = await UserService.getTestGenerationHistory(undefined);
        set({testGenHistoryPast: response})
    },

    getTestGenCurrentActivities: async () => {
        const response = await TestService.getCurrentTestGenActivities();
        set({currentActivities: response})
    },

    getTestGenCurrentActivitiesLongPoll: async () => {
        const { getTestGenCurrentActivitiesLongPoll } = get();
        try {
            const { data }: { data?: ActivityDto[] } = await ActivityService.longPolling();
            if (Array.isArray(data) && data.length > 0) {
                set({ currentActivities: data });
            }
            getTestGenCurrentActivitiesLongPoll();
        } catch (error) {
            console.error(error);
            setTimeout(getTestGenCurrentActivitiesLongPoll, 5000);
        }
    },

    addCurrentActivity: (activity) => {
        const { currentActivities } = get();
        const index = currentActivities.findIndex((obj: { cid: string; }) => obj.cid === activity.cid);
        let updatedHistory;
        if (index !== -1) {
            updatedHistory = [...currentActivities.slice(0, index), activity, ...currentActivities.slice(index + 1)];
        } else {
            updatedHistory = [...currentActivities, activity];
        }
        set({ testGenHistoryCurrent: updatedHistory });
    },

    deleteCurrentActivity: (activity) => {
        const { currentActivities } = get();
        const index = currentActivities.indexOf(activity);
        if (index !== -1) {
            const updatedActivities = [...currentActivities.slice(0, index), ...currentActivities.slice(index + 1)];
            set({ currentActivities: updatedActivities });
        }
    }

}))

import {create} from "zustand";
import UserService, {BulkActivityDeleteDto} from "../services/UserService";
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
    startDate: Date,
    endDate: Date,
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
    deleteCurrentUserActivities: () => void,
    getTestGenHistory: () => void;
    loading: boolean;
    setLoading: (flag: boolean) => void;
    getTestGenCurrentActivitiesLongPoll: () => void;
    deleteFinishedUserActivitiesFromServer: () => void;
    initState: () => void;
}

const DeletableStatuses = new Set([
    GenerationStatus.FAILED,
    GenerationStatus.SUCCESS,
]);

export const useUserStore = create<UserStore>((set: any, get: any) => ({
    testGenHistoryPast: [],
    currentActivities: [],
    loading: false,
    user: undefined,
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
                const inProcessJobs = data.filter((a: ActivityDto) => !DeletableStatuses.has(a.status)).length;
                if (inProcessJobs > 0) {
                    await getTestGenCurrentActivitiesLongPoll();
                }
            }
            return;
        } catch (error) {
            console.error(error);
            setTimeout(getTestGenCurrentActivitiesLongPoll, 5000);
        }
    },

    deleteCurrentUserActivities: async () => {
        const { currentActivities } = get();

        const activitiesToDelete = currentActivities.filter((a: ActivityDto) => DeletableStatuses.has(a.status));
        if (activitiesToDelete.length === 0) {
            return;
        }

        const updatedActivities = currentActivities.filter((a: ActivityDto) =>
            !activitiesToDelete.some((activity: ActivityDto) => activity.cid === a.cid)
        );

        set({ currentActivities: updatedActivities });
    },

    deleteFinishedUserActivitiesFromServer: async () => {
        const { currentActivities } = get();

        const activitiesToDelete = currentActivities.filter((a: ActivityDto) => DeletableStatuses.has(a.status));
        if (activitiesToDelete.length === 0) {
            return;
        }

        const deleteDto: BulkActivityDeleteDto = {
            cids: activitiesToDelete.map((a: ActivityDto) => a.cid)
        };

        await UserService.deleteCurrentUserActivities(deleteDto);
    },

    initState: async () => {
        const { getTestGenCurrentActivitiesLongPoll, deleteFinishedUserActivitiesFromServer } = get();
        const data : ActivityDto[] = await TestService.getCurrentTestGenActivities();
        if (Array.isArray(data)) {
            set({ currentActivities: data });
        }
        if (data.length > 0) {
            await deleteFinishedUserActivitiesFromServer();
            const inProcessJobs = data.filter((a: ActivityDto) => !DeletableStatuses.has(a.status)).length;
            if (inProcessJobs > 0) {
                await getTestGenCurrentActivitiesLongPoll();
            }
        }
        return;
    }


}))

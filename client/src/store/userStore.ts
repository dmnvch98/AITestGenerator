import {create} from "zustand";
import UserService, {BulkActivityDeleteDto} from "../services/UserService";
import {GenerationStatus, QueryOptions} from "./types";
import TestService from "../services/TestService";
import ActivityService from "../services/activities/ActivityService";
import {UserTest} from "./tests/testStore";

export interface TestGenActivity {
    uuid: string,
    id: number,
    startDate: Date,
    endDate: Date,
    status: GenerationStatus,
    testTitle: string,
    fileName: string,
    testId: number,
    failCode: number;
    cid: string;
}

export interface ActivityDto {
    uuid: string,
    startDate: Date,
    endDate: Date,
    status: GenerationStatus,
    testTitle: string,
    fileName: string,
    testId?: number,
    failCode: number;
    cid: string;
}

export interface UserStore {
    currentActivities: TestGenActivity[];
    totalPages: number,
    totalElements: number;
    testGenHistoryPast: TestGenActivity[],
    getTestGenCurrentActivities: () => void,
    deleteCurrentUserActivities: () => void,
    getTestGenHistory: (options?: QueryOptions) => void;
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
    totalElements: 0,
    totalPages: 0,
    currentActivities: [],
    loading: false,
    user: undefined,
    setLoading: (flag) => {
        set({loading: flag})
    },
    getTestGenHistory: async (options?: QueryOptions) => {
        const {history, totalPages, totalElements} = await UserService.getTestGenerationHistory(options);
        set({testGenHistoryPast: history, totalPages, totalElements})
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

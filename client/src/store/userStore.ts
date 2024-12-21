import { create } from "zustand";
import UserService, { BulkActivityDeleteDto } from "../services/UserService";
import { GenerationStatus, QueryOptions } from "./types";
import TestService from "../services/TestService";
import ActivityService from "../services/activities/ActivityService";
import { QuestionType } from "./tests/types";
import { convertCurrentActivity } from "./helper";

export interface ActivityDto {
    uuid?: string;
    id?: number;
    startDate: Date;
    endDate: Date;
    status: GenerationStatus;
    testTitle: string;
    fileName: string;
    testId?: number;
    failCode: number;
    cid: number;
    queuedQuestionTypes: QuestionType[];
    processedQuestionTypes: QuestionType[];
    readyPercentage?: number; // Calculated field
}

export interface UserStore {
    currentActivities: ActivityDto[];
    totalPages: number;
    totalElements: number;
    testGenHistoryPast: ActivityDto[];
    getTestGenCurrentActivities: () => void;
    getTestGenHistory: (options?: QueryOptions) => void;
    loading: boolean;
    setLoading: (flag: boolean) => void;
    getTestGenCurrentActivitiesLongPoll: () => void;
    deleteFinishedUserActivitiesFromServer: () => void;
    initState: (isUnmounted?: () => boolean) => void;
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

    setLoading: (flag) => {
        set({ loading: flag });
    },

    getTestGenHistory: async (options?: QueryOptions) => {
        const { history, totalPages, totalElements } = await UserService.getTestGenerationHistory(options);
        set({ testGenHistoryPast: history, totalPages, totalElements });
    },

    getTestGenCurrentActivities: async () => {
        const response = await TestService.getCurrentTestGenActivities();
        const enrichedData = convertCurrentActivity(response);
        set({ currentActivities: enrichedData });
    },

    getTestGenCurrentActivitiesLongPoll: async (isUnmounted?: () => boolean) => {
        const { getTestGenCurrentActivitiesLongPoll } = get();
        try {
            const { data }: { data?: ActivityDto[] } = await ActivityService.longPolling();
            if (isUnmounted && isUnmounted()) return;

            if (Array.isArray(data) && data.length > 0) {
                const enrichedData = convertCurrentActivity(data);
                set({ currentActivities: enrichedData });

                const inProcessJobs = data.filter((a: ActivityDto) => !DeletableStatuses.has(a.status)).length;
                if (inProcessJobs > 0) {
                    await getTestGenCurrentActivitiesLongPoll(isUnmounted);
                }
            }
        } catch (error) {
            if (isUnmounted && isUnmounted()) return;
            setTimeout(() => {
                getTestGenCurrentActivitiesLongPoll(isUnmounted);
            }, 5000);
        }
    },

    deleteFinishedUserActivitiesFromServer: async () => {
        const { currentActivities, getTestGenCurrentActivities } = get();

        const activitiesToDelete = currentActivities.filter((a: ActivityDto) => DeletableStatuses.has(a.status));
        if (activitiesToDelete.length === 0) {
            return;
        }

        const deleteDto: BulkActivityDeleteDto = {
            cids: activitiesToDelete.map((a: ActivityDto) => a.cid),
        };

        await UserService.deleteCurrentUserActivities(deleteDto);
        await getTestGenCurrentActivities();
    },

    initState: async (isUnmounted?: () => boolean) => {
        const { getTestGenCurrentActivitiesLongPoll } = get();
        const data: ActivityDto[] = await TestService.getCurrentTestGenActivities();
        if (isUnmounted && isUnmounted()) return;

        if (Array.isArray(data)) {
            const enrichedData = data.map((item) => ({
                ...item,
                readyPercentage: item.queuedQuestionTypes?.length && item.processedQuestionTypes?.length
                    ? (100 / item.queuedQuestionTypes.length) * item.processedQuestionTypes.length
                    : 0,
            }));
            set({ currentActivities: enrichedData });
        }
        if (data.length > 0) {
            const inProcessJobs = data.filter((a: ActivityDto) => !DeletableStatuses.has(a.status)).length;
            if (inProcessJobs > 0) {
                await getTestGenCurrentActivitiesLongPoll(isUnmounted);
            }
        }
    },
}));

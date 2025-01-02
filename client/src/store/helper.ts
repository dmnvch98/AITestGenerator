import {ActivityDto} from "./userStore";

export const convertCurrentActivity = (data: ActivityDto[]): ActivityDto[] => {
    return data.map(item => ({
        ...item,
        readyPercentage: item.queuedQuestionTypes?.length && item.processedQuestionTypes?.length
            ? (100 / item.queuedQuestionTypes.length) * item.processedQuestionTypes.length
            : 0,
    }));
};
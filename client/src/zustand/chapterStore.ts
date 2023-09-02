import {create} from "zustand";
import ChapterService from "../services/ChapterService";

export interface Chapter {
    "id": number | undefined,
    "title": string,
    "text": ChapterText
}

export interface ChapterText {
    "id": number | null,
    "content": string
}

export interface UserChapters {
    chapters: Chapter[],
    getChapters: () => void;
    getUserChaptersByIdsIn: (ids: number[]) => Promise<void>;
    newChapterTitle: string;
    newTextContent: string;
    selectedChapterIds: number[];
    saveChapter: () => Promise<Boolean>;
    deleteChapter: (id: number) => void;
    setTitle: (title: string) => void;
    setContent: (content: string) => void;
    chapterSavedFlag: boolean,
    chapterDeletedFlag: boolean,
    chapterUpdatedFlag: boolean,
    toggleChapterSavedFlag: () => void;
    toggleChapterDeletedFlag: () => void;
    toggleChapterUpdatedFlag: () => void;
    selectedChapter: Chapter | null,
    clearSelectedChapter: () => void;
    selectChapter: (chapter: Chapter) => void;
    setSelectedIdsToArray: (ids: number[]) => void;
    deleteInBatch: () => void;
    updateChapter: () => void;
    isChapterEditing: boolean,
    toggleIsChapterEditing: () => void;
}

export const useChapterStore = create<UserChapters>((set: any, get: any) => ({
    chapters: [],
    newChapterTitle: "",
    newTextContent: "",
    chapterSavedFlag: false,
    chapterDeletedFlag: false,
    selectedChapter: null,
    selectedChapterIds: [],
    chapterUpdatedFlag: false,
    isChapterEditing: false,
    getChapters: async () => {
        const chapters = await ChapterService.getAllUserChapters();
        set({chapters});
    },
    getUserChaptersByIdsIn: async (ids: number[]) => {
        const chapters = await ChapterService.getUserChaptersByIdsIn(ids);
        set({chapters});
    },
    saveChapter: async (): Promise<Boolean> => {
        const chapterText: ChapterText = {
            content: get().newTextContent,
            id: null
        }

        const chapter: Chapter = {
            title: get().newChapterTitle,
            text: chapterText,
            id: undefined
        }
        const response = await ChapterService.saveChapter(chapter);
        if (response) {
            set({chapterSavedFlag: true})
            return true;
        }
        return false;
    },
    deleteChapter: async (id: number) => {
        const response = await ChapterService.deleteChapter(id);
        if (response) {
            get().getChapters();
            set({chapterDeletedFlag: true})
        }
    },
    setContent: async (content: string) => {
        set({newTextContent: content})
    },
    setTitle: async (title: string) => {
        set({newChapterTitle: title})
        set({newChapterTitle: title})
    },
    toggleChapterSavedFlag: async () => {
        set({chapterSavedFlag: !get().chapterSavedFlag})
    },
    toggleChapterDeletedFlag: async () => {
        set({chapterDeletedFlag: !get().chapterDeletedFlag})
    },
    selectChapter: async (chapter: Chapter) => {
        set({selectedChapter: chapter})
    },
    setSelectedIdsToArray: (ids: number[]) => {
        set({selectedChapterIds: ids})
    },
    deleteInBatch: async () => {
        const response = await ChapterService.deleteInBatch(get().selectedChapterIds);
        if (response) {
            get().getChapters();
            set({chapterDeletedFlag: true})
        }
    },
    updateChapter: async () => {
        const selectedChapter: Chapter = get().selectedChapter;
        let updatedChapter: Chapter;
        let updatedChapterText: ChapterText;

        if (get().newChapterTitle != "") {
            updatedChapter = {
                ...selectedChapter, title: get().newChapterTitle
            }
        } else {
            updatedChapter = selectedChapter;
        }

        if (get().newTextContent != "") {
            updatedChapterText = {
                ...selectedChapter.text, content: get().newTextContent
            }
        } else {
            updatedChapterText = selectedChapter.text;
        }

        updatedChapter.text = updatedChapterText;

        const response = await ChapterService.updateChapter(updatedChapter);
        if (response) {
            set({chapterUpdatedFlag: true, selectedChapter: response, newChapterTitle: response.title, newTextContent: response.text.content})

            return true;
        }
        return false;
    },
    toggleChapterUpdatedFlag: () => {
        set({chapterUpdatedFlag: !get().chapterUpdatedFlag})
    },
    clearSelectedChapter: () => {
        set({selectedChapter: null})
    },
    toggleIsChapterEditing: () => {
        set({isChapterEditing: !get().isChapterEditing})
    }
}))
import {create} from "zustand";
import ChapterService from "../services/ChapterService";

export interface Chapter {
    "id": number | null,
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
    newChapterTitle: string,
    newTextContent: string,
    saveChapter: () => Promise<Boolean>;
    deleteChapter: (id: number) => void;
    setTitle: (title: string) => void;
    setContent: (content: string) => void;
    chapterSavedFlag: boolean,
    chapterDeletedFlag: boolean,
    toggleChapterSavedFlag: () => void;
    toggleChapterDeletedFlag: () => void;
    selectedChapterForPreview: Chapter | null,
    setChapterForPreview: (chapter: Chapter) => void;
}

export const useChapterStore = create<UserChapters>((set: any, get: any) => ({
    chapters: [],
    newChapterTitle: "",
    newTextContent: "",
    chapterSavedFlag: false,
    chapterDeletedFlag: false,
    selectedChapterForPreview: null,

    getChapters: async () => {
        const chapters = await ChapterService.getChapters();
        set({ chapters });
    },
    saveChapter: async (): Promise<Boolean> => {
        const chapterText: ChapterText = {
            content: get().newTextContent,
            id: null
        }

        const chapter: Chapter = {
            title: get().newChapterTitle,
            text: chapterText,
            id: null
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
    },
    toggleChapterSavedFlag: async () => {
        set({chapterSavedFlag: !get().chapterSavedFlag})
    },
    toggleChapterDeletedFlag: async () => {
        set({chapterDeletedFlag: !get().chapterDeletedFlag})
    },
    setChapterForPreview: async (chapter: Chapter) => {
        set({selectedChapterForPreview: chapter})
    }
}))
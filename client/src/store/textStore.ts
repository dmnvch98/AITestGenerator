import {create} from "zustand";
import TextService from "../services/TextService";

export interface UserText {
    "id": number | undefined,
    "testIds": number[] | undefined,
    "title": string,
    "content": string
}

export interface UserTexts {
    texts: UserText[],
    getTexts: () => void;
    getUserTextsByIdIn: (ids: number[]) => Promise<void>;
    newTextTitle: string;
    newTextContent: string;
    selectedTextIds: number[];
    saveText: () => Promise<number | undefined>;
    deleteText: (id: number) => void;
    setTitle: (title: string) => void;
    setContent: (content: string) => void;
    textSavedFlag: boolean,
    textDeletedFlag: boolean,
    textUpdatedFlag: boolean,
    toggleTextSavedFlag: () => void;
    toggleTextDeletedFlag: () => void;
    toggleTextUpdatedFlag: () => void;
    selectedText: UserText | null,
    clearSelectedText: () => void;
    selectText: (text: UserText) => void;
    setSelectedIdsToArray: (ids: number[]) => void;
    deleteInBatch: () => void;
    updateText: () => void;
    isTextEditing: boolean,
    toggleIsTextEditing: () => void;
}

export const useTextStore = create<UserTexts>((set: any, get: any) => ({
    texts: [],
    newTextTitle: "",
    newTextContent: "",
    textSavedFlag: false,
    textDeletedFlag: false,
    selectedText: null,
    selectedTextIds: [],
    textUpdatedFlag: false,
    isTextEditing: false,
    getTexts: async () => {
        const texts = await TextService.getAllUserTexts();
        set({texts: texts});
    },
    getUserTextsByIdIn: async (ids: number[]) => {
        const texts = await TextService.getUserTextsByIdsIn(ids);
        set({texts: texts});
    },
    saveText: async (): Promise<number | undefined> => {
        const userText: UserText = {
            content: get().newTextContent,
            title: get().newTextTitle,
            id: undefined,
            testIds: undefined
        }

        const response = await TextService.saveText(userText);
        if (response) {
            set({textSavedFlag: true})
            return response.id;
        }
        return undefined;
    },
    deleteText: async (id: number) => {
        const response = await TextService.deleteText(id);
        if (response) {
            get().getTexts();
            set({textDeletedFlag: true})
        }
    },
    setContent: async (content: string) => {
        set({newTextContent: content})
    },
    setTitle: async (title: string) => {
        set({newTextTitle: title})
    },
    toggleTextSavedFlag: async () => {
        set({textSavedFlag: !get().textSavedFlag})
    },
    toggleTextDeletedFlag: async () => {
        set({textDeletedFlag: !get().textDeletedFlag})
    },
    selectText: async (text: UserText) => {
        set({selectedText: text})
    },
    setSelectedIdsToArray: (ids: number[]) => {
        set({selectedTextIds: ids})
    },
    deleteInBatch: async () => {
        const response = await TextService.deleteInBatch(get().selectedTextIds);
        if (response) {
            get().getTexts();
            set({textDeletedFlag: true})
        }
    },
    updateText: async () => {
        const updatedText: UserText = {
            ...get().selectedText, title: get().newTextTitle, content: get().newTextContent
        }

        const response = await TextService.updateText(updatedText);
        if (response) {
            set({
                textUpdatedFlag: true,
                selectedText: response,
                newTextTitle: response.title,
                newTextContent: response.content
            })

            return true;
        }
        return false;
    },
    toggleTextUpdatedFlag: () => {
        set({textUpdatedFlag: !get().textUpdatedFlag})
    },
    clearSelectedText: () => {
        set({selectedText: undefined})
    },
    toggleIsTextEditing: () => {
        set({isTextEditing: !get().isTextEditing})
    }
}))
// store/textSettingsStore.ts
import create from "zustand";

interface TextSettingsState {
    titleFontSize: number;
    setTitleFontSize: (value: number) => void;
    questionFontSize: number;
    setQuestionFontSize: (value: number) => void;
    answerFontSize: number;
    setAnswerFontSize: (value: number) => void;
    titleFontWeight: number;
    setTitleFontWeight: (value: number) => void;
    questionFontWeight: number;
    setQuestionFontWeight: (value: number) => void;
}

const useTextSettingsStore = create<TextSettingsState>((set) => ({
    titleFontSize: 20,
    setTitleFontSize: (value) => set({ titleFontSize: value }),
    questionFontSize: 14,
    questionFontWeight: 600,
    setQuestionFontSize: (value) => set({ questionFontSize: value }),
    answerFontSize: 14,
    setAnswerFontSize: (value) => set({ answerFontSize: value }),
    titleFontWeight: 600,
    setTitleFontWeight: (value) => set({ titleFontWeight: value }),
    setQuestionFontWeight: (value) => set({ questionFontWeight: value }),
}));

export default useTextSettingsStore;

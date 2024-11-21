import { create } from 'zustand';

interface SettingsState {
    maxQuestionsCount: number;
    minAnswersCount: number;
    temperature: number;
    topP: number;
    setQuestions: (value: any) => void;
    setAnswers: (value: any) => void;
    setTemperature: (value: number) => void;
    setTopP: (value: number) => void;
}

export const useGenerateTestStore = create<SettingsState>((set) => ({
    maxQuestionsCount: 10,
    minAnswersCount: 4,
    temperature: 0.5,
    topP: 0.8,
    setQuestions: (value: number) => set({ maxQuestionsCount: value }),
    setAnswers: (value: number) => set({ minAnswersCount: value }),
    setTemperature: (value: number) => set({ temperature: value }),
    setTopP: (value: number) => set({ topP: value }),
}));

import create from 'zustand';

interface SettingsState {
    questions: number;
    answers: number;
    temperature: number;
    topP: number;
    setQuestions: (value: number) => void;
    setAnswers: (value: number) => void;
    setTemperature: (value: number) => void;
    setTopP: (value: number) => void;
}

export const useGenerateTestStore = create<SettingsState>((set) => ({
    questions: 10,
    answers: 4,
    temperature: 0.5,
    topP: 0.8,
    setQuestions: (value: number) => set({ questions: value }),
    setAnswers: (value: number) => set({ answers: value }),
    setTemperature: (value: number) => set({ temperature: value }),
    setTopP: (value: number) => set({ topP: value }),
}));

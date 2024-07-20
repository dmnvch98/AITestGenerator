import {create} from "zustand";
import ExportService from "../../services/ExportService";
import {UserTest} from "./testStore";

export interface ExportTestRequestDto {
    exportFormat: string;
    filePath: string;
    questionsLabel: string;
    questionTextLabel: string;
    answerOptionsLabel: string;
    optionTextLabel: string;
    isCorrectLabel: string;
}

export interface ExportStore {
    modalOpen: boolean,
    toggleModelOpen: () => void;
    exportFormat: string,
    setExportFormat: (format: string) => void,
    filePath: string,
    setFilePath: (path: string) => void,
    questionsLabel: string,
    setQuestionsLabel: (label: string) => void,
    questionTextLabel: string,
    setQuestionTextLabel: (label: string) => void,
    answerOptionsLabel: string,
    setAnswerOptionsLabel: (label: string) => void,
    optionTextLabel: string,
    setOptionTextLabel: (label: string) => void,
    isCorrectLabel: string,
    setIsCorrectLabel: (label: string) => void,
    selectedTestId: number,
    setSelectedTestId: (id: number) => void,
    selectedTestTitle: string,
    setSelectedTestTitle: (title: string) => void;
    exportTest: (test: UserTest) => void;
}

export const useExportStore = create<ExportStore>((set, get) => ({
    modalOpen: false,
    toggleModelOpen: () => set({modalOpen: !get().modalOpen}),
    exportFormat: "JSON",
    setExportFormat: (format) => set({exportFormat: format}),
    filePath: "",
    setFilePath: (path) => set({filePath: path}),
    questionsLabel: "questions",
    setQuestionsLabel: (label) => set({questionsLabel: label}),
    questionTextLabel: "questionText",
    setQuestionTextLabel: (label) => set({questionTextLabel: label}),
    answerOptionsLabel: "answerOptions",
    setAnswerOptionsLabel: (label) => set({answerOptionsLabel: label}),
    optionTextLabel: "optionText",
    setOptionTextLabel: (label) => set({optionTextLabel: label}),
    isCorrectLabel: "isCorrect",
    setIsCorrectLabel: (label) => set({isCorrectLabel: label}),
    selectedTestId: 80,
    setSelectedTestId: (testId: number) => set({selectedTestId: testId}),
    selectedTestTitle: "",
    setSelectedTestTitle: (testTitle: string) => set({selectedTestTitle: testTitle}),
    exportTest: async (test: UserTest) => {
        const dto: ExportTestRequestDto = {
            exportFormat: get().exportFormat,
            filePath: get().filePath,
            questionsLabel: get().questionsLabel,
            questionTextLabel: get().questionTextLabel,
            answerOptionsLabel: get().answerOptionsLabel,
            optionTextLabel: get().optionTextLabel,
            isCorrectLabel: get().isCorrectLabel,
        }
        await ExportService.exportTest(dto, test.id, test.title)
    }
}));

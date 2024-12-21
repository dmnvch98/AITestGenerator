export enum QuestionType {
    MULTIPLE_CHOICE_SINGLE_ANSWER = 'MULTIPLE_CHOICE_SINGLE_ANSWER',
    MULTIPLE_CHOICE_MULTIPLE_ANSWERS = 'MULTIPLE_CHOICE_MULTIPLE_ANSWERS',
    TRUE_FALSE = 'TRUE_FALSE',
    FILL_IN_THE_BLANKS = 'FILL_IN_THE_BLANKS'
}

export interface QuestionTypeQuantity {
    questionType: QuestionType;
    maxQuestions: number;
}

export interface GenerateTestRequest {
    hashedFileName: string,
    originalFileName?: string
    params: QuestionTypeQuantity[];
}

export const questionTypeTranslations: Record<QuestionType, string> = {
    [QuestionType.MULTIPLE_CHOICE_SINGLE_ANSWER]: "Одиночный выбор",
    [QuestionType.MULTIPLE_CHOICE_MULTIPLE_ANSWERS]: "Множественный выбор",
    [QuestionType.TRUE_FALSE]: "Верно/Неверно",
    [QuestionType.FILL_IN_THE_BLANKS]: "Заполнение пропусков",
};

export interface QuestionTypeFlags {
    [key: string]: {
        singleAnswer: boolean;
    };
}

export const questionTypeFlags: QuestionTypeFlags = {
    [QuestionType.MULTIPLE_CHOICE_SINGLE_ANSWER]: { singleAnswer: true },
    [QuestionType.MULTIPLE_CHOICE_MULTIPLE_ANSWERS]: { singleAnswer: false },
    [QuestionType.TRUE_FALSE]: { singleAnswer: true },
    [QuestionType.FILL_IN_THE_BLANKS]: { singleAnswer: true },
};
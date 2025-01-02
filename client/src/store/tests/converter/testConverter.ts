import {CreateTestRequestDto, UpsertTestRequestDto, UserTest} from "../testStore";

export const convertTest = (test: UserTest | CreateTestRequestDto): UpsertTestRequestDto => {
    return {
        id: 'id' in test ? test.id : undefined,
        title: test.title,
        questions: test.questions.map((question) => ({
            questionText: question.questionText,
            questionType: question.questionType,
            answerOptions: question.answerOptions.map((answerOption) => ({
                optionText: answerOption.optionText,
                correct: answerOption.correct,
            })),
        })),
    };
};
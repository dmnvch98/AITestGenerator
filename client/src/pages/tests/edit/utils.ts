import {CreateTestRequestDto, UserTest} from "../../../store/tests/testStore";
import {AlertMessage} from "../../../store/types";
import NotificationService from "../../../services/notification/NotificationService";
import {QuestionType} from "../../../store/tests/types";

interface InvalidQuestion {
    index: number,
    message: string,
    id: number
}

export const validateTest = (
    localTest: UserTest | CreateTestRequestDto,
    setCurrentQuestionIndex: (index: number) => void
): { valid: boolean, invalidQuestions: InvalidQuestion[] } => {
    let valid = true;
    const invalidQuestions: InvalidQuestion[] = [];

    if (!localTest?.title?.trim()) {
        NotificationService.addAlert(new AlertMessage('Заголовок теста не должен быть пустым', 'error'));
        valid = false;
    }

    if (localTest.questions.length < 1) {
        NotificationService.addAlert(new AlertMessage('Тест должен содержать минимум один вопрос', 'error'));
        valid = false;
    }

    localTest?.questions.forEach((q, index) => {
        if (!q.questionText) {
            invalidQuestions.push({ index, message: "Вопрос не должен быть пустым", id: q.id });
            valid = false;
        }
        if (q.answerOptions.length < 2) {
            invalidQuestions.push({ index, message: "Вопрос должен иметь минимум 2 ответа", id: q.id });
            valid = false;
        }
        if (!q.answerOptions.some(a => a.correct)) {
            invalidQuestions.push({ index, message: "Вопрос должен иметь минимум один правильный ответ", id: q.id });
            valid = false;
        }
        if (q.answerOptions.some(a => a.optionText === "")) {
            invalidQuestions.push({ index, message: "Ответ не должен быть пустым", id: q.id });
            valid = false;
        }
        switch (q.questionType) {
            case QuestionType.MULTIPLE_CHOICE_MULTIPLE_ANSWERS: {
                if (q.answerOptions.filter(a => a.correct).length < 2) {
                    invalidQuestions.push({ index, message: "Данный тип вопроса должен иметь минимум 2 правильных ответа", id: q.id });
                    valid = false;
                }
                return;
            }
            case QuestionType.FILL_IN_THE_BLANKS: {
                if (!q.questionText.includes('_')) {
                    invalidQuestions.push({ index, message: "Данный тип вопроса должен иметь минимум одно нижнее подчеркивание (_) для вставки пропуска", id: q.id });
                    valid = false;
                }
            }
        }
    });

    if (!valid) {
        setCurrentQuestionIndex(invalidQuestions[0]?.index || 0);
    }

    return { valid, invalidQuestions };
};

export const createNewTest = () => ({
    title: '',
    questions: [
        {
            id: getNanoTime(),
            questionText: '',
            questionType: QuestionType.MULTIPLE_CHOICE_SINGLE_ANSWER,
            answerOptions: [
                {
                    id: getNanoTime(),
                    optionText: '',
                    correct: false
                }
            ]
        }
    ]
});

export const createNewQuestion = () => ({
    id: getNanoTime(),
    questionText: "",
    questionType: QuestionType.MULTIPLE_CHOICE_SINGLE_ANSWER,
    answerOptions: [
        {
            id: getNanoTime(),
            optionText: "",
            correct: false
        }
    ]
});

export const getNanoTime = (): number => {
    const timeInMillis = performance.now();
    return Math.round(timeInMillis * 1_000_000);
}

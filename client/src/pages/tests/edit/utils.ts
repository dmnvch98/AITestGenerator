import {CreateTestRequestDto, UserTest} from "../../../store/tests/testStore";
import {v4 as uuidv4} from "uuid";

export const validateTest = (
    localTest: UserTest | CreateTestRequestDto,
    setAlert: (alerts: { id: number, message: string, severity: 'error' }[]) => void,
    setCurrentQuestionIndex: (index: number) => void
): { valid: boolean, invalidQuestions: { index: number, message: string }[] } => {
    let valid = true;
    const invalidQuestions: { index: number, message: string, id?: string }[] = [];

    if (!localTest?.title?.trim()) {
        setAlert([{ id: Date.now(), message: 'Заголовок теста не должен быть пустым', severity: 'error' }]);
        valid = false;
    }

    if (localTest.questions.length < 1) {
        setAlert([{ id: Date.now(), message: 'Тест должен содержать минимум один вопрос', severity: 'error' }]);
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
        if (!q.answerOptions.some(a => a.isCorrect)) {
            invalidQuestions.push({ index, message: "Вопрос должен иметь минимум один правильный ответ", id: q.id });
            valid = false;
        }
        if (q.answerOptions.some(a => a.optionText === "")) {
            invalidQuestions.push({ index, message: "Ответ не должен быть пустым", id: q.id });
            valid = false;
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
            id: uuidv4(),
            questionText: '',
            answerOptions: [
                {
                    id: uuidv4(),
                    optionText: '',
                    isCorrect: false
                }
            ]
        }
    ]
});

export const createNewQuestion = () => ({
    id: uuidv4(),
    questionText: "",
    answerOptions: [
        {
            id: uuidv4(),
            optionText: "",
            isCorrect: false
        }
    ],
    isCorrect: false,
});
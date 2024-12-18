import React, { useCallback } from "react";
import { AnswerOption, Question } from "../../../store/tests/testStore";
import { QuestionType } from "../../../store/tests/types";
import { AccordionDetails, AccordionSummary, Box } from "@mui/material";
import { QuestionHeader } from "./QuestionHeader";
import { AnswerList } from "./AnswersList";
import { v4 as uuidv4 } from "uuid";
import { QuestionTypeSelector } from "../../../pages/tests/edit/components/QuestionTypeSelector";

export interface QuestionEditProps {
    question: Question;
    onQuestionChange: (question: Question) => void;
    onDelete: () => void;
    errorMessage: string;
    questionNumber?: number;
    viewMode?: 'list' | 'paginated';
    last?: boolean;
}

export const QuestionEdit: React.FC<QuestionEditProps> = ({
                                                              question,
                                                              onQuestionChange,
                                                              onDelete,
                                                              errorMessage,
                                                              questionNumber,
                                                              last,
                                                              viewMode,
                                                          }) => {
    const isSingleChoice = question.questionType !== QuestionType.MULTIPLE_CHOICE_MULTIPLE_ANSWERS;
    const showActions = question.questionType !== QuestionType.TRUE_FALSE;

    const addAnswerOption = useCallback(() => {
        const newOption: AnswerOption = {
            id: uuidv4(),
            optionText: '',
            isCorrect: false,
        };
        onQuestionChange({ ...question, answerOptions: [...question.answerOptions, newOption] });
    }, [onQuestionChange, question]);

    const updateAnswerOption = useCallback((updatedOption: AnswerOption) => {
        const updatedOptions = question.answerOptions.map(option =>
            option.id === updatedOption.id ? updatedOption : option
        );
        onQuestionChange({ ...question, answerOptions: updatedOptions });
    }, [onQuestionChange, question.answerOptions]);

    const toggleCorrectAnswer = useCallback((updatedOption: AnswerOption) => {
        const updatedOptions = question.answerOptions.map(option => ({
            ...option,
            isCorrect: isSingleChoice ? option.id === updatedOption.id : option.isCorrect,
        }));
        onQuestionChange({ ...question, answerOptions: updatedOptions });
    }, [onQuestionChange, question.answerOptions, isSingleChoice]);

    const handleQuestionTypeChange = useCallback((newType: QuestionType) => {
        let newAnswers: AnswerOption[] = question.answerOptions;

        if (newType === QuestionType.TRUE_FALSE) {
            newAnswers = [
                { id: uuidv4(), optionText: 'Верно', isCorrect: true },
                { id: uuidv4(), optionText: 'Неверно', isCorrect: false }
            ];
        } else if ([QuestionType.MULTIPLE_CHOICE_SINGLE_ANSWER, QuestionType.FILL_IN_THE_BLANKS].includes(newType)) {
            let firstCorrect = false;
            newAnswers = newAnswers.map(answer => {
                if (answer.isCorrect && !firstCorrect) {
                    firstCorrect = true;
                    return { ...answer, isCorrect: true };
                }
                return { ...answer, isCorrect: false };
            });
        }

        onQuestionChange({
            ...question,
            questionType: newType,
            answerOptions: newAnswers
        });
    }, [onQuestionChange, question]);

    return (
        <Box sx={{ pl: 2 }}>
            <AccordionSummary>
                <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                    <Box sx={{ mb: 2 }}>
                        <QuestionHeader
                            questionNumber={questionNumber}
                            questionText={question.questionText}
                            onChange={(text) => onQuestionChange({ ...question, questionText: text })}
                            onDelete={onDelete}
                        />
                    </Box>
                    <QuestionTypeSelector
                        value={question.questionType}
                        onChange={handleQuestionTypeChange}
                    />
                </Box>
            </AccordionSummary>
            <AccordionDetails>
                <AnswerList
                    answerOptions={question.answerOptions}
                    onAnswerChange={updateAnswerOption}
                    onDeleteAnswer={(id) =>
                        onQuestionChange({
                            ...question,
                            answerOptions: question.answerOptions.filter(option => option.id !== id),
                        })
                    }
                    onAddAnswer={addAnswerOption}
                    singleChoice={isSingleChoice}
                    displayActions={showActions}
                    correctAnswerChanged={toggleCorrectAnswer}
                />
            </AccordionDetails>
        </Box>
    );
};

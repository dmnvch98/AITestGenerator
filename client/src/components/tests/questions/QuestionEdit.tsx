import React from "react";
import {AnswerOption, Question} from "../../../store/tests/testStore";
import {QuestionType} from "../../../store/tests/types";
import {AccordionDetails, AccordionSummary, Box} from "@mui/material";
import {QuestionHeader} from "./QuestionHeader";
import {AnswerList} from "./AnswersList";
import {v4 as uuidv4} from "uuid";

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
                                                              question, onQuestionChange, onDelete, errorMessage, questionNumber, last, viewMode,
                                                          }) => {
    const singleChoiceQuestion = question.questionType !== QuestionType.MULTIPLE_CHOICE_MULTIPLE_ANSWERS;
    const displayActions = question.questionType !== QuestionType.TRUE_FALSE;

    const handleAddAnswerOption = () => {
        const newOption: AnswerOption = {
            id: uuidv4(),
            optionText: '',
            isCorrect: false,
        };
        onQuestionChange({...question, answerOptions: [...question.answerOptions, newOption]});
    };

    const handleMultiAnswerOptionChange = (updatedOption: AnswerOption) => {
        const updatedOptions = question.answerOptions.map(option =>
            option.id === updatedOption.id ? updatedOption : option
        );
        onQuestionChange({...question, answerOptions: updatedOptions});
    };

    const handleSingleAnswerOptionChange = (updatedOption: AnswerOption) => {
        const updatedOptions = question.answerOptions.map(option => ({
            ...option,
            isCorrect: option.id === updatedOption.id,
        }));
        onQuestionChange({...question, answerOptions: updatedOptions});
    };

    const handleAnswerOptionChange = singleChoiceQuestion ? handleSingleAnswerOptionChange : handleMultiAnswerOptionChange;

    const renderQuestionType = () => {
        return (
            <Box>
                <AccordionSummary>
                    <QuestionHeader
                        questionNumber={questionNumber}
                        questionText={question.questionText}
                        onChange={(text) => onQuestionChange({...question, questionText: text})}
                        onDelete={onDelete}
                    />
                </AccordionSummary>
                <AccordionDetails>
                    <AnswerList
                        answerOptions={question.answerOptions}
                        onAnswerChange={handleAnswerOptionChange}
                        onDeleteAnswer={(id) =>
                            onQuestionChange({
                                ...question,
                                answerOptions: question.answerOptions.filter(option => option.id !== id),
                            })
                        }
                        onAddAnswer={handleAddAnswerOption}
                        singleChoice={singleChoiceQuestion}
                        displayActions={displayActions}
                    />
                </AccordionDetails>
            </Box>
        );
    };

    return <div>{renderQuestionType()}</div>;
};

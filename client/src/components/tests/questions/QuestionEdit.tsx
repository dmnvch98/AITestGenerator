import React from "react";
import {Question} from "../../../store/tests/testStore";
import {QuestionType} from "../../../store/tests/types";
import {SingleAnswer} from "./SingleAnswer";
import {MultipleAnswers} from "./MultipleAnswer";

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
    const renderQuestionType = () => {
        if (question.questionType === QuestionType.MULTIPLE_CHOICE_MULTIPLE_ANSWERS) {
            return (
                <MultipleAnswers
                    question={question}
                    onQuestionChange={onQuestionChange}
                    onDelete={onDelete}
                    errorMessage={errorMessage}
                    questionNumber={questionNumber}
                />
            );
        } else {
            return (
                <SingleAnswer
                    question={question}
                    onQuestionChange={onQuestionChange}
                    onDelete={onDelete}
                    errorMessage={errorMessage}
                    questionNumber={questionNumber}
                />
            );
        }
    };

    return <div>{renderQuestionType()}</div>;
};

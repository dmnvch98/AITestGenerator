import React from "react";
import { Box } from "@mui/material";
import { Question } from "../../../../store/tests/testStore";
import {QuestionView} from "../../../../components/tests/questions/QuestionView";
import {QuestionEdit} from "../../../../components/tests/questions/QuestionEdit";

interface QuestionListViewProps {
    questions: Question[];
    onQuestionChange: (question: Question) => void;
    onDelete: (id: number) => void;
    invalidQuestions: { index: number; message: string }[];
    editMode: boolean;
}

interface QuestionPaginatedViewProps extends QuestionListViewProps {
    currentQuestionIndex: number;
    onSelectQuestion: (index: number) => void;
}

export const QuestionListView: React.FC<QuestionListViewProps> = ({
                                                                      questions,
                                                                      onQuestionChange,
                                                                      onDelete,
                                                                      invalidQuestions,
                                                                      editMode
                                                                  }) => (
    <Box>
        {questions.map((question, index) => (
            <Box key={index} display="flex" alignItems="center" my={2}>
                <Box flexGrow={1}>
                    {editMode ? (
                        <QuestionEdit
                            question={question}
                            questionNumber={index + 1}
                            onQuestionChange={onQuestionChange}
                            onDelete={() => onDelete(question.id)}
                            errorMessage={invalidQuestions.find((item) => item.index === index)?.message || ""}
                        />
                    ) : (

                        <QuestionView
                            last={index + 1 === questions.length}
                            question={question}
                            viewMode="list"
                            questionNumber={index + 1}
                        />
                    )}
                </Box>
            </Box>
        ))}
    </Box>
);

export const QuestionPaginatedView: React.FC<QuestionPaginatedViewProps> = ({
                                                                                questions,
                                                                                currentQuestionIndex,
                                                                                onQuestionChange,
                                                                                onDelete,
                                                                                invalidQuestions,
                                                                                editMode
                                                                            }) => (
    <Box>
        {questions[currentQuestionIndex] && (
            <Box display="flex" alignItems="center" my={2}>
                <Box flexGrow={1}>
                    {editMode ? (
                        <QuestionEdit
                            questionNumber={currentQuestionIndex + 1}
                            question={questions[currentQuestionIndex]}
                            onQuestionChange={onQuestionChange}
                            onDelete={() => onDelete(questions[currentQuestionIndex].id)}
                            errorMessage={invalidQuestions.find((item) => item.index === currentQuestionIndex)?.message || ""}
                        />
                    ) : (
                        <QuestionView
                            question={questions[currentQuestionIndex]}
                            questionNumber={currentQuestionIndex + 1}
                        />
                    )}
                </Box>
            </Box>
        )}
    </Box>
);

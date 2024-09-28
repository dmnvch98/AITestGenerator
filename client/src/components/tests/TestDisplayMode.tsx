import React from "react";
import { Box } from "@mui/material";
import QuestionEdit from "../../components/tests/questions/QuestionEdit";
import { Question } from "../../store/tests/testStore";

interface QuestionListViewProps {
    questions: Question[];
    onQuestionChange: (question: Question) => void;
    onDelete: (id: number) => void;
    invalidQuestions: { index: number; message: string }[];
}

interface QuestionPaginatedViewProps extends QuestionListViewProps {
    currentQuestionIndex: number;
    onSelectQuestion: (index: number) => void;
}

export const QuestionListView: React.FC<QuestionListViewProps> = ({
                                                                      questions,
                                                                      onQuestionChange,
                                                                      onDelete,
                                                                      invalidQuestions
                                                                  }) => (
    <Box>
        {questions.map((question, index) => (
            <Box key={index} display="flex" alignItems="center" my={2}>
                <Box flexGrow={1}>
                    <QuestionEdit
                        expandable={true}
                        question={question}
                        questionNumber={index + 1}
                        onQuestionChange={onQuestionChange}
                        onDelete={() => onDelete(question.id as number)}
                        errorMessage={invalidQuestions.find((item) => item.index === index)?.message || ""}
                    />
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
                                                                                invalidQuestions
                                                                            }) => (
    <Box>
        {questions[currentQuestionIndex] && (
            <Box display="flex" alignItems="center" my={2}>
                <Box flexGrow={1}>
                    <QuestionEdit
                        expandable={false}
                        questionNumber={currentQuestionIndex + 1}
                        question={questions[currentQuestionIndex]}
                        onQuestionChange={onQuestionChange}
                        onDelete={() => onDelete(questions[currentQuestionIndex].id as number)}
                        errorMessage={invalidQuestions.find((item) => item.index === currentQuestionIndex)?.message || ""}
                    />
                </Box>
            </Box>
        )}
    </Box>
);

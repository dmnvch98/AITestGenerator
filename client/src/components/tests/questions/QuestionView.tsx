import {Question} from "../../../store/tests/testStore";
import {Divider, Typography} from "@mui/material";
import {AnswerOptionView} from "../answerOptions/AnswerOptionView";
import Box from "@mui/material/Box";
import React from "react";

interface QuestionViewProps {
    question: Question;
    last?: boolean;
    viewMode?: "list" | "paginated";
    questionNumber: number;
}

export const QuestionView = ({question, last, viewMode, questionNumber}: QuestionViewProps) => {

    return (
        <Box>
            <Box sx={{display: 'flex', alignItems: 'center', width: '100%', pl: 4, pr: 4}}>
                <Typography variant="subtitle1" sx={{fontWeight: 600}} align="left">
                    {`Вопрос ${questionNumber}: ${question.questionText}`}
                </Typography>
            </Box>
            <Box>
                {question.answerOptions.map((answerOption) => (
                    <AnswerOptionView
                        key={answerOption.id}
                        answerOption={answerOption}
                    />
                ))}
            </Box>
            {(!last && viewMode === 'list') && <Divider sx={{mt: 2, mb: 2}}/>}
        </Box>
    );
};

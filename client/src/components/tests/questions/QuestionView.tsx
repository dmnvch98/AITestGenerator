import { Question } from "../../../store/tests/testStore";
import { Accordion, AccordionDetails, AccordionSummary, Typography } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import React, { useState } from "react";
import { AnswerOptionView } from "../answerOptions/AnswerOptionView";

export const QuestionView = ({ question }: { question: Question }) => {
    const [expanded, setExpanded] = useState(false);

    const handleAccordionChange = () => {
        setExpanded(!expanded);
    };

    return (
        <Accordion expanded={expanded} onChange={handleAccordionChange}>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
            >
                <Typography align='left' sx={{ fontWeight: expanded ? 'bold' : 'normal' }}>
                    {question.questionText}
                </Typography>
            </AccordionSummary>
            <AccordionDetails>
                {question.answerOptions.map((answerOption, index) => (
                    <AnswerOptionView
                        key={answerOption.id}
                        answerOption={answerOption}
                        isLast={index === question.answerOptions.length - 1}
                    />
                ))}
            </AccordionDetails>
        </Accordion>
    );
};

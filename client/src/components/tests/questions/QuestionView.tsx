import { Question } from "../../../store/tests/testStore";
import {Accordion, AccordionDetails, AccordionSummary, IconButton, Typography} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import React, { useState } from "react";
import { AnswerOptionView } from "../answerOptions/AnswerOptionView";
import Box from "@mui/material/Box";

export const QuestionView = ({ question }: { question: Question }) => {
    const [expanded, setExpanded] = useState(false);

    const handleAccordionChange = () => {
        setExpanded(!expanded);
    };

    return (
        <Accordion expanded={expanded} onChange={handleAccordionChange}>
            <AccordionSummary
                aria-controls="panel1a-content"
                id="panel1a-header"
            >
            <Box sx={{display: 'flex', alignItems: 'center', width: '100%'}}>
                <IconButton
                    edge="start"
                >
                    <ExpandMoreIcon/>
                </IconButton>
                <Typography align='left' sx={{fontWeight: expanded ? 'bold' : 'normal'}}>
                    {question.questionText}
                </Typography>
            </Box>
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

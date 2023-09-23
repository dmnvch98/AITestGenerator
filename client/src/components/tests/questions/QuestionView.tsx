import {Question} from "../../../store/tests/testStore";
import {Accordion, AccordionDetails, AccordionSummary, Grid, ListItem, Typography} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import React from "react";
import {AnswerOptionView} from "../answerOptions/AnswerOptionView";


export const QuestionView = ({ question }: { question: Question }) => {
    return (
        <Accordion>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
            >
                <Typography align='left'>{question.questionText}</Typography>
            </AccordionSummary>
            <AccordionDetails>

                    {question.answerOptions.map((answerOption, index) => (
                        <AnswerOptionView key={index} answerOption={answerOption} />
                    ))}

            </AccordionDetails>
        </Accordion>
    )
}



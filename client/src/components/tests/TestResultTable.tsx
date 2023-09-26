import {TestResult} from "../../store/tests/passTestStore";
import {Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography} from "@mui/material";
import React from "react";
import Divider from "@mui/material/Divider";
import {DoneLabel} from "../utils/DoneLabel";
import {NoLabel} from "../utils/NoLabel";

export const TestResultTable = ({testResult}: { testResult: TestResult }) => {
    const passedQuestions = testResult.questionAnswers.filter(x => x.isPassed).length;
    const allQuestionsNumber = testResult.questionAnswers.length;
    return (
        <>
            <Box sx={{mb: 4}}>
                <Typography align='left'>
                    Тема теста: {testResult.testTitle}
                </Typography>

                <Typography align='left'>
                    Пройдено вопросов: {passedQuestions} из {allQuestionsNumber}
                </Typography>

                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Question Number</TableCell>
                                <TableCell>Is Passed</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {testResult.questionAnswers.map((answer, index) => (
                                <TableRow key={index}>
                                    <TableCell>{answer.questionNumber}</TableCell>
                                    <TableCell>{answer.isPassed ? <DoneLabel/> : <NoLabel/>}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </>
    )
}
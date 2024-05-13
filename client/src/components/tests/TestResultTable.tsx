import {TestResult} from "../../store/tests/passTestStore";
import {Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography} from "@mui/material";
import React from "react";
import {DoneLabel} from "../utils/DoneLabel";
import {NoLabel} from "../utils/NoLabel";
import DateTimeUtils from '../../utils/DateTimeUtils';

export const TestResultTable = ({testResult}: { testResult: TestResult }) => {
    const passedQuestions = testResult.questionAnswers.filter(x => x.passed).length;
    const allQuestionsNumber = testResult.questionAnswers.length;

    return (
        <>
            <Box sx={{mb: 4}}>
                <Typography align='left'>
                    Тема теста: {testResult.testTitle}
                </Typography>

                <Typography align='left'>
                    Время теста: {DateTimeUtils.formatDate(testResult.testPassedTime)}
                </Typography>


                <Typography align='left'>
                    Пройдено вопросов: {passedQuestions} из {allQuestionsNumber}
                </Typography>

                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Номер вопроса</TableCell>
                                <TableCell>Пройден</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {testResult.questionAnswers.map((answer, index) => (
                                <TableRow key={index}>
                                    <TableCell>{answer.questionNumber}</TableCell>
                                    <TableCell>{answer.passed ? <DoneLabel/> : <NoLabel/>}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </>
    )
}

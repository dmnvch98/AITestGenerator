import React from "react";
import { LoggedInUserPage } from "../../components/main/LoggedInUserPage";
import { usePassTestStore } from "../../store/tests/passTestStore";
import {
    Container,
    Typography,
    Table,
    TableContainer,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    Button,
} from "@mui/material";

const TestResultContent = () => {
    const answers = usePassTestStore((state) => state.answers);
    const totalQuestions = answers.length;
    const passedQuestions = answers.filter((answer) => answer.isPassed).length;
    console.log(answers)

    return (
        <Container>
            <Typography variant="h4" align='left'>Результаты теста</Typography>
            <Typography align='left'>
                Пройдено вопросов: {passedQuestions} из {totalQuestions}
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
                        {answers.map((answer, index) => (
                            <TableRow key={index}>
                                <TableCell>{answer.questionNumber}</TableCell>
                                <TableCell>{answer.isPassed ? "Yes" : "No"}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

        </Container>
    );
};

export const TestResults = () => {
    return <LoggedInUserPage mainContent={<TestResultContent />} />;
};

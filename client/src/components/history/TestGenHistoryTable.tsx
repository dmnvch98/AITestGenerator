import {TestGenHistory} from "../../store/userStore";
import React from 'react';
import {CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from '@mui/material';
import DateTimeUtils from '../../utils/DateTimeUtils';
import {DoneLabel} from '../utils/DoneLabel';
import {NoLabel} from '../utils/NoLabel';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import Link from '@mui/material/Link';
import {AccessTime} from "@mui/icons-material";
import {GenerationStatus} from "../../store/types";

interface TestGenHistoryTableProps {
    testGenHistory: TestGenHistory[];
}

export const TestGenHistoryTable: React.FC<TestGenHistoryTableProps> = ({ testGenHistory }) => {

    const getStatusComponent = (status: GenerationStatus) => {
        switch (status) {
            case GenerationStatus.WAITING:
                return <AccessTime/>
            case GenerationStatus.SUCCESS:
                return <DoneLabel />;
            case GenerationStatus.IN_PROCESS:
                return <CircularProgress size={24}/>;
            case GenerationStatus.FAILED:
                return <NoLabel />;
            default:
                return <QuestionMarkIcon />;
        }
    };

    return (
        <>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Тест</TableCell>
                            <TableCell>Файл</TableCell>
                            <TableCell>Начало генерации</TableCell>
                            <TableCell>Конец генерации</TableCell>
                            <TableCell>Статус</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {testGenHistory.map((th, index) => (
                            <TableRow key={index}>
                                <TableCell>
                                    <Link
                                        color='inherit'
                                        underline='none'
                                        href={`/tests/${th.testId}`}>
                                        {th.testTitle}
                                    </Link>
                                </TableCell>
                                <TableCell>{th.fileName}</TableCell>
                                <TableCell>{DateTimeUtils.formatDateTime(th.generationStart)}</TableCell>
                                <TableCell>{DateTimeUtils.formatDateTime(th.generationEnd)}</TableCell>
                                <TableCell>{getStatusComponent(th.generationStatus)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
}

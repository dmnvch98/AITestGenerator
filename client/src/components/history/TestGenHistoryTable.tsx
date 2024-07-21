import {useUserStore} from "../../store/userStore";
import React from 'react';
import { CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import DateTimeUtils from '../../utils/DateTimeUtils';
import { DoneLabel } from '../utils/DoneLabel';
import { NoLabel } from '../utils/NoLabel';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import Link from '@mui/material/Link';
import {AccessTime} from "@mui/icons-material";

export const TestGenHistoryTable = () => {
    const testGenHistory = useUserStore(state => state.testGenHistory);

    const getStatusComponent = (status: string) => {
        switch (status) {
            case "Waiting":
                return <AccessTime/>
            case "Success":
                return <DoneLabel />;
            case "In process":
                return <CircularProgress size={24}/>;
            case "Failed":
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
                            <TableCell>Текст</TableCell>
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
                                <TableCell>
                                    <Link
                                        color='inherit'
                                        underline='none'
                                        href={`/texts/${th.textId}`}>
                                        {th.textTitle}
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

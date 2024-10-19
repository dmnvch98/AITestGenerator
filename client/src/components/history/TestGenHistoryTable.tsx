import {ActivityDto, TestGenHistory} from "../../store/userStore";
import React, {useState} from 'react';
import {
    Table,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button, CircularProgress, Grid,
} from '@mui/material';
import DateTimeUtils from '../../utils/DateTimeUtils';
import Link from '@mui/material/Link';
import {GenerationErrorModal} from "../generationErrors/GenerationErrorModal";
import StatusIndicator from "../status/StatusIndicator";

interface TestGenHistoryTableProps {
    testGenHistory: TestGenHistory[] | ActivityDto[];
    loading: boolean;
}

export const TestGenHistoryTable: React.FC<TestGenHistoryTableProps> = ({testGenHistory, loading}) => {
    const [modalOpen, setModalOpen] = useState(false);
    const [failCode, setFailCode] = useState<number | null>(null);

    const showErrorButton = () => {
        return testGenHistory.some(t => t.failCode);
    };

    const handleOpenModal = (code: number) => {
        setFailCode(code);
        setModalOpen(true);
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
                            {showErrorButton() && <TableCell>Детали ошибки</TableCell>}
                        </TableRow>
                    </TableHead>
                    {
                        loading ? (
                                <TableRow>
                                    <TableCell colSpan={6} sx={{border: 'none'}}>
                                        <Grid container justifyContent="center" alignItems="center" style={{ height: '100px' }}>
                                            <CircularProgress />
                                        </Grid>
                                    </TableCell>
                                </TableRow>
                        ) :
                            (
                                testGenHistory.map((th, index) => (
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
                                        <TableCell>{DateTimeUtils.formatDateTime(th.startDate)}</TableCell>
                                        <TableCell>{DateTimeUtils.formatDateTime(th.endDate)}</TableCell>
                                        <TableCell><StatusIndicator status={th.status}/></TableCell>
                                        <TableCell>
                                            {
                                                th.failCode &&
                                                (
                                                    <Button
                                                        variant="outlined"
                                                        color="primary"
                                                        onClick={() => handleOpenModal(th.failCode)}
                                                    >
                                                        Посмотреть
                                                    </Button>
                                                )
                                            }

                                        </TableCell>
                                    </TableRow>
                                )
                            ))
                    }
                </Table>
            </TableContainer>

            <GenerationErrorModal
                failCode={failCode}
                open={modalOpen}
                onClose={() => {
                    setModalOpen(false);
                    setFailCode(null);
                }}
            />
        </>
    );
};

import React, {useEffect, useState} from 'react';
import {
    Badge,
    Box,
    IconButton,
    Popover,
    CircularProgress, Grid, Paper
} from '@mui/material';
import TimerIcon from '@mui/icons-material/Timer';
import {GenerationStatus} from "../../store/types";
import {AccessTime} from "@mui/icons-material";
import {DoneLabel} from "../utils/DoneLabel";
import {NoLabel} from "../utils/NoLabel";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
import {TestGenHistory, useUserStore} from "../../store/userStore";
import {useTestGenHistoryWebSocket} from "../../store/useTestGenHistoryWebSocket";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";

export const ActiveJobBadge = () => {
    const MAX_FILENAME_LENGTH = 30;
    const {getCurrentUser, user} = useUserStore();
    const {getTestGenHistoryCurrent} = useUserStore();
    const [testGenHistoryCurrent, setTestGenHistoryCurrent] = useState<TestGenHistory[]>([]);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setTestGenHistoryCurrent(prev =>
            prev.filter(h => ![GenerationStatus.SUCCESS, GenerationStatus.FAILED].includes(h.generationStatus))
        );
        setAnchorEl(null);
    };

    useEffect(() => {
        const fetchInitialData = async () => {
            const result = await getTestGenHistoryCurrent();
            if (result) {
                setTestGenHistoryCurrent(result);
            }
        };

        getCurrentUser();
        fetchInitialData();
    }, [getCurrentUser, getTestGenHistoryCurrent]);

    // Обновляем данные через веб-сокет
    const newTestGenHistory = useTestGenHistoryWebSocket(user?.id);

    // Когда приходят новые данные через веб-сокет, добавляем их к существующим
    useEffect(() => {
        if (newTestGenHistory) { // Убедитесь, что новое значение существует
            const index = testGenHistoryCurrent.findIndex((obj: { id: number; }) => obj.id === newTestGenHistory.id);
            let updatedHistory;
            if (index !== -1) {
                // Если элемент уже существует, обновляем его
                updatedHistory = [
                    ...testGenHistoryCurrent.slice(0, index),
                    newTestGenHistory,
                    ...testGenHistoryCurrent.slice(index + 1)
                ];
            } else {
                // Если элемента нет, добавляем новый
                updatedHistory = [...testGenHistoryCurrent, newTestGenHistory];
            }
            setTestGenHistoryCurrent(updatedHistory);
        }
    }, [newTestGenHistory]);


    const getStatusComponent = (status: GenerationStatus) => {
        switch (status) {
            case GenerationStatus.WAITING:
                return <AccessTime/>;
            case GenerationStatus.SUCCESS:
                return <DoneLabel/>;
            case GenerationStatus.IN_PROCESS:
                return <CircularProgress size={24}/>;
            case GenerationStatus.FAILED:
                return <NoLabel/>;
            default:
                return <QuestionMarkIcon/>;
        }
    };

    const truncateString = (str: string) => {
        return str.length > MAX_FILENAME_LENGTH ? `${str.slice(0, MAX_FILENAME_LENGTH)}...` : str;
    };

    return (
        <Box>
            <IconButton onClick={handleClick}>
                <Badge badgeContent={testGenHistoryCurrent.length} color="secondary" anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right'
                }}>
                    <TimerIcon/>
                </Badge>
            </IconButton>
            <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
            >
                <Paper sx={{ padding: 2, minWidth: '300px', maxWidth: '350px' }}>
                    <b>Текущие работы</b>
                    <Divider sx={{ mt: 1, mb: 1 }} />
                    {testGenHistoryCurrent.length > 0 ? (
                        <Grid container spacing={2}>
                            <Grid item xs={9}>
                                <Typography variant="subtitle1" fontSize={14}><strong>Название файла</strong></Typography>
                            </Grid>
                            <Grid item xs={3} display="flex" justifyContent="center" alignItems="center">
                                <Typography variant="subtitle1" fontSize={14}><strong>Статус</strong></Typography>
                            </Grid>
                            {testGenHistoryCurrent.map((item, index) => (
                                <React.Fragment key={index}>
                                    <Grid item xs={9}>
                                        <Typography fontSize={14}>{truncateString(item.fileName)}</Typography>
                                    </Grid>
                                    <Grid item xs={3} display="flex" justifyContent="center" alignItems="center" style={{ width: '100%' }}>
                                        {getStatusComponent(item.generationStatus)}
                                    </Grid>
                                </React.Fragment>
                            ))}
                        </Grid>
                    ) : (
                        <Typography variant="subtitle1" align="center" fontSize={14}>Нет активных работ</Typography>
                    )}
                </Paper>
            </Popover>
        </Box>
    );
};

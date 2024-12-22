import React, {useState, useCallback} from 'react';
import {
    Badge,
    Box,
    IconButton,
    Popover,
    Typography,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useUserStore } from "../../store/userStore";
import StatusIndicator from "../status/StatusIndicator";

export const ActiveJobBadge = () => {
    const MAX_FILENAME_LENGTH = 35;
    const { currentActivities, deleteFinishedUserActivitiesFromServer } = useUserStore();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const navigate = useNavigate();

    const handleClick = useCallback((event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    }, []);

    const handleClose = useCallback(() => {
        // при закрытии поповера вызываем удаление завершённых активностей
        deleteFinishedUserActivitiesFromServer();
        setAnchorEl(null);
    }, [deleteFinishedUserActivitiesFromServer]);

    const truncateString = useCallback((str: string) => (
        str.length > MAX_FILENAME_LENGTH ? `${str.slice(0, MAX_FILENAME_LENGTH)}...` : str
    ), []);

    // Генерируем JSX для списка активностей в виде таблицы
    const getCurrentJobComponent = useCallback(() => {
        return (
            <>
                <TableContainer>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell align="center"><strong>Статус</strong></TableCell>
                                <TableCell><strong>Файл</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {currentActivities.map((item) => (
                                <TableRow
                                    key={item.uuid}
                                    hover
                                    // При клике на строку переходим на нужную страницу
                                    onClick={() => navigate("/tests?activeTab=history")}
                                    sx={{ cursor: 'pointer' }} // меняем курсор
                                >
                                    <TableCell
                                        align="center"
                                        sx={{ verticalAlign: 'middle' }}
                                    >
                                        <StatusIndicator
                                            status={item.status}
                                            readyPercentage={item.readyPercentage}
                                        />
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            maxWidth: 250,
                                            whiteSpace: 'nowrap',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis'
                                        }}
                                    >
                                        {truncateString(item.fileName)}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mr: 1, mt: 1 }}>
                    <Button
                        variant="text"
                        size="small"
                        onClick={() => navigate("/tests?activeTab=history")}
                    >
                        Подробнее
                    </Button>
                </Box>
            </>
        );
    }, [currentActivities, truncateString, navigate]);

    const getNoJobsComponent = useCallback(() => (
        <Box sx={{ m: 2 }}>
            <Typography>Нет активных работ</Typography>
        </Box>
    ), []);

    return (
        <Box>
            <IconButton onClick={handleClick}>
                <Badge
                    badgeContent={currentActivities.length}
                    color="secondary"
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                >
                    <NotificationsIcon />
                </Badge>
            </IconButton>

            <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                transformOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Box sx={{ width: 400, bgcolor: 'background.paper', p: 1 }}>
                    <Box sx={{ ml: 1 }}>
                        <Typography variant="subtitle1">
                            <strong>Активные работы</strong>
                        </Typography>
                    </Box>

                    {currentActivities.length > 0 ? (
                        getCurrentJobComponent()
                    ) : (
                        getNoJobsComponent()
                    )}
                </Box>
            </Popover>
        </Box>
    );
};

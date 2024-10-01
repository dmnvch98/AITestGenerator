import React, { useEffect, useState } from 'react';
import { Badge, Box, CircularProgress, IconButton, Popover, Typography, Divider, ListItemButton, ListItemText, ListItemIcon, List, ListItem } from '@mui/material';
import TimerIcon from '@mui/icons-material/Timer';
import { GenerationStatus } from "../../store/types";
import { AccessTime } from "@mui/icons-material";
import { DoneLabel } from "../utils/DoneLabel";
import { NoLabel } from "../utils/NoLabel";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
import { TestGenHistory, useUserStore } from "../../store/userStore";
import { useTestGenHistoryWebSocket } from "../../store/useTestGenHistoryWebSocket";

export const ActiveJobBadge = () => {
    const MAX_FILENAME_LENGTH = 30;
    const { getCurrentUser, getTestGenHistoryCurrent, user } = useUserStore();
    const [testGenHistoryCurrent, setTestGenHistoryCurrent] = useState<TestGenHistory[]>([]);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setTestGenHistoryCurrent(prev => prev.filter(h => ![GenerationStatus.SUCCESS, GenerationStatus.FAILED].includes(h.generationStatus)));
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

    const newTestGenHistory = useTestGenHistoryWebSocket(user?.id);

    useEffect(() => {
        if (newTestGenHistory) {
            const updatedHistory = testGenHistoryCurrent.map(h => (h.id === newTestGenHistory.id ? newTestGenHistory : h));
            if (!testGenHistoryCurrent.some(h => h.id === newTestGenHistory.id)) {
                updatedHistory.push(newTestGenHistory);
            }
            setTestGenHistoryCurrent(updatedHistory);
        }
    }, [newTestGenHistory]);

    const statusComponents = {
        [GenerationStatus.WAITING]: <AccessTime />,
        [GenerationStatus.SUCCESS]: <DoneLabel />,
        [GenerationStatus.IN_PROCESS]: <CircularProgress size={24} />,
        [GenerationStatus.FAILED]: <NoLabel />,
    };

    const getStatusComponent = (status: GenerationStatus) => statusComponents[status] || <QuestionMarkIcon />;

    const truncateString = (str: string) => (str.length > MAX_FILENAME_LENGTH ? `${str.slice(0, MAX_FILENAME_LENGTH)}...` : str);

    const getCurrentJobComponent = (item: TestGenHistory) => {
        const link = item.testId ? `/tests/${item.testId}` : (item.generationStatus === GenerationStatus.FAILED ? '/tests?activeTab=history' : '/tests?activeTab=history&currentHistory=true');

        return (
            <ListItem disablePadding key={item.id}>
                <ListItemButton component="a" href={link}>
                    <ListItemText primary={truncateString(item.fileName)} secondary={item.testId ? "Нажмите чтобы открыть тест" : ""} />
                    <ListItemIcon sx={{ml: 2}}>
                        {getStatusComponent(item.generationStatus)}
                    </ListItemIcon>
                </ListItemButton>
            </ListItem>
        );
    };

    const getNoJobsComponent = () => {
        return (
            <ListItem disablePadding sx={{p: 2}}>
                <ListItemText primary='Нет активных работ'/>
            </ListItem>
        );
    };

    return (
        <Box>
            <IconButton onClick={handleClick}>
                <Badge badgeContent={testGenHistoryCurrent.length} color="secondary" anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
                    <TimerIcon />
                </Badge>
            </IconButton>
            <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                transformOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Box sx={{ width: '100%', maxWidth: 400, minWidth: 300, bgcolor: 'background.paper' }}>
                    <Box sx={{ p: 1, ml: 1 }}>
                        <Typography variant="subtitle1"><strong>Активные работы</strong></Typography>
                    </Box>
                    <Divider />
                    <List>
                        {testGenHistoryCurrent.length > 0 ? testGenHistoryCurrent.map(getCurrentJobComponent) : getNoJobsComponent()}
                    </List>
                </Box>
            </Popover>
        </Box>
    );
};

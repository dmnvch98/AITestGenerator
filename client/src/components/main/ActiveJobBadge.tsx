import React, { useState, useCallback} from 'react';
import { Badge, Box, IconButton, Popover, Typography, Divider, ListItemText, ListItemIcon, List, ListItem } from '@mui/material';
import TimerIcon from '@mui/icons-material/Timer';
import { GenerationStatus } from "../../store/types";
import { ActivityDto, useUserStore } from "../../store/userStore";
import DeleteIcon from "@mui/icons-material/Delete";
import StatusIndicator from "../status/StatusIndicator";

const DeletableStatuses = new Set([
    GenerationStatus.FAILED,
    GenerationStatus.SUCCESS,
]);

export const ActiveJobBadge = () => {
    const MAX_FILENAME_LENGTH = 30;
    const { currentActivities, deleteCurrentUserActivities } = useUserStore();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleClick = useCallback((event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    }, []);

    const handleClose = useCallback(() => {
        setAnchorEl(null);
    }, []);

    const handleDelete = useCallback((item: ActivityDto) => {
        // deleteCurrentUserActivities(item);
    }, [deleteCurrentUserActivities]);

    const truncateString = useCallback((str: string) => (
        str.length > MAX_FILENAME_LENGTH ? `${str.slice(0, MAX_FILENAME_LENGTH)}...` : str
    ), []);

    const getCurrentJobComponent = useCallback((item: ActivityDto) => {
        if (!item) return null;

        const showDeleteButton = () => {
            return DeletableStatuses.has(item.status);
        };

        return (
            <ListItem
                secondaryAction={ showDeleteButton() && (
                    <Box onClick={() => handleDelete(item)} aria-label="Delete activity">
                        <IconButton edge="end" aria-label="delete">
                            <DeleteIcon />
                        </IconButton>
                    </Box>
                )}
            >
                <ListItemIcon sx={{ml: 2}}>
                    <StatusIndicator status={item.status}/>
                </ListItemIcon>
                <ListItemText
                    primary={truncateString(item.fileName)}
                />
            </ListItem>
        );
    }, [truncateString, handleDelete]);

    const getNoJobsComponent = useCallback(() => (
        <ListItem disablePadding sx={{ p: 2 }}>
            <ListItemText primary='Нет активных работ' />
        </ListItem>
    ), []);

    return (
        <Box>
            <IconButton onClick={handleClick}>
                <Badge badgeContent={currentActivities.length} color="secondary" anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
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
                <Box sx={{ width: '100%', minWidth: 400, bgcolor: 'background.paper' }}>
                    <Box sx={{ p: 1, ml: 1 }}>
                        <Typography variant="subtitle1"><strong>Активные работы</strong></Typography>
                    </Box>
                    <Divider />
                    <List>
                        {currentActivities.length > 0 ? currentActivities.map(getCurrentJobComponent) : getNoJobsComponent()}
                    </List>
                </Box>
            </Popover>
        </Box>
    );
};

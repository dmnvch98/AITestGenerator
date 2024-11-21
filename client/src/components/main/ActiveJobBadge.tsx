import React, {useState, useCallback} from 'react';
import {
    Badge,
    Box,
    IconButton,
    Popover,
    Typography,
    Divider,
    ListItemText,
    ListItemIcon,
    List,
    ListItem
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import {useUserStore} from "../../store/userStore";
import StatusIndicator from "../status/StatusIndicator";
import Link from "@mui/material/Link";
import Button from "@mui/material/Button";

export const ActiveJobBadge = () => {
    const MAX_FILENAME_LENGTH = 35;
    const {currentActivities, deleteFinishedUserActivitiesFromServer} = useUserStore();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleClick = useCallback((event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    }, []);

    const handleClose = useCallback(() => {
        deleteFinishedUserActivitiesFromServer();
        setAnchorEl(null);
    }, []);

    const truncateString = useCallback((str: string) => (
        str.length > MAX_FILENAME_LENGTH ? `${str.slice(0, MAX_FILENAME_LENGTH)}...` : str
    ), []);

    const getCurrentJobComponent = useCallback(() => {
        if (currentActivities.length > 0) {
            return (
                <>
                    {currentActivities.map(item => (
                        <Link href="/tests?activeTab=history" color="inherit" underline="none">
                            <ListItem key={item.id} sx={{ml: -1}}>
                                <ListItemIcon>
                                    <StatusIndicator status={item.status}/>
                                </ListItemIcon>
                                <ListItemText
                                    primary={truncateString(item.fileName)}
                                    sx={{
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis'
                                    }}/>
                            </ListItem>
                        </Link>
                    ))}
                    <Box sx={{display: 'flex', justifyContent: 'flex-end', mr: 1, mb: -1}}>
                        <Link href="/tests?activeTab=history" color="inherit" underline="none">
                            <Button variant="text" size="small">Подробнее</Button>
                        </Link>
                    </Box>
                </>
            );
        }

        return null;
    }, [currentActivities, truncateString]);

    const getNoJobsComponent = useCallback(() => (
        <ListItem sx={{m: 2, ml: -1}}>
            <ListItemText primary='Нет активных работ'/>
        </ListItem>
    ), []);

    return (
        <Box>
            <IconButton onClick={handleClick}>
                <Badge badgeContent={currentActivities.length} color="secondary"
                       anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}>
                    <NotificationsIcon/>
                </Badge>
            </IconButton>
            <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
                transformOrigin={{vertical: 'top', horizontal: 'center'}}
            >
                <Box sx={{width: 400, bgcolor: 'background.paper', p: 1}}>
                    <Box sx={{ml: 1}}>
                        <Typography variant="subtitle1"><strong>Активные работы</strong></Typography>
                    </Box>
                    <Divider/>
                    <List>
                        {currentActivities.length > 0 ? getCurrentJobComponent() : getNoJobsComponent()}
                    </List>
                </Box>
            </Popover>
        </Box>
    );
};

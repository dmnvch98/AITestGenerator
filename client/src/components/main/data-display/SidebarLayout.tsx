import React, { useState } from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    Drawer,
    List,
    ListItem,
    ListItemText,
    Box,
    CssBaseline,
    IconButton,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

const drawerWidth = 240;

const SidebarLayout: React.FC = () => {
    const [leftDrawerOpen, setLeftDrawerOpen] = useState(false);
    const [rightDrawerOpen, setRightDrawerOpen] = useState(false);

    const toggleLeftDrawer = () => {
        setLeftDrawerOpen(!leftDrawerOpen);
    };

    const toggleRightDrawer = () => {
        setRightDrawerOpen(!rightDrawerOpen);
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />

            {/* Хидер */}
            <AppBar position="fixed">
                <Toolbar>
                    <IconButton edge="start" color="inherit" onClick={toggleLeftDrawer} aria-label="menu">
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div">
                        My App
                    </Typography>
                </Toolbar>
            </AppBar>

            {/* Левый сайдбар */}
            <Drawer
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                    },
                }}
                variant="temporary"
                anchor="left"
                open={leftDrawerOpen}
                onClose={toggleLeftDrawer}
            >
                <Toolbar />
                <List>
                    {['Home', 'About', 'Contact'].map((text) => (
                        <ListItem button key={text} onClick={toggleLeftDrawer}>
                            <ListItemText primary={text} />
                        </ListItem>
                    ))}
                </List>
            </Drawer>

            {/* Контент страницы */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    bgcolor: 'background.default',
                    p: 3,
                    marginLeft: leftDrawerOpen ? drawerWidth : 0,
                }}
            >
                <Toolbar />
                <Typography paragraph>
                    Welcome to the main content area. Here you can add your main page content.
                </Typography>

                {/* Кнопка для правого сайдбара */}
                <Box sx={{ position: 'absolute', top: 64, right: 0, padding: 2 }}>
                    <IconButton color="primary" onClick={toggleRightDrawer}>
                        {rightDrawerOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                    </IconButton>
                </Box>

                {/* Правый сайдбар */}
                <Drawer
                    sx={{
                        width: drawerWidth,
                        flexShrink: 0,
                        '& .MuiDrawer-paper': {
                            width: drawerWidth,
                            boxSizing: 'border-box',
                        },
                    }}
                    variant="temporary"
                    anchor="right"
                    open={rightDrawerOpen}
                    onClose={toggleRightDrawer}
                >
                    <Toolbar />
                    <AppBar position="static" sx={{ width: drawerWidth, zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                        <Toolbar>
                            <Typography variant="h6">Actions</Typography>
                        </Toolbar>
                    </AppBar>
                    <Box sx={{ padding: 2, marginTop: 8 }}>
                        <List>
                            {['Edit', 'Delete', 'Settings'].map((action) => (
                                <ListItem button key={action} onClick={toggleRightDrawer}>
                                    <ListItemText primary={action} />
                                </ListItem>
                            ))}
                        </List>
                    </Box>
                </Drawer>
            </Box>
        </Box>
    );
};

export default SidebarLayout;

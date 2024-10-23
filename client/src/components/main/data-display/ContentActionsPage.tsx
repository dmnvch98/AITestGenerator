import Box from "@mui/material/Box";
import { Drawer, Paper } from "@mui/material";
import { LoggedInUserPage } from "../LoggedInUserPage";
import React from "react";

interface Props {
    content: React.ReactNode;
    actions: React.ReactNode;
}

const drawerWidth = 240;

const ContentActions: React.FC<Props> = ({ content, actions }) => {
    return (
        <Box sx={{ display: 'flex' }}>
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    bgcolor: 'background.default',
                    marginRight: `${drawerWidth}px`,
                    transition: 'margin-right 0.3s',
                }}
            >
                <Paper sx={{ overflowY: 'auto' }}>
                    {content}
                </Paper>
            </Box>

            <Drawer
                variant="permanent"
                anchor="right"
                sx={{
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                        height: '100vh',
                        mt: 8,
                        overflowY: 'auto',
                    },
                }}
            >
                <Box sx={{ padding: 2, height: '100%', overflowY: 'auto' }}>
                    {actions}
                </Box>
            </Drawer>
        </Box>
    );
}

export const ContentActionsPage: React.FC<Props> = ({ content, actions }) => {
    return (
        <LoggedInUserPage mainContent={<ContentActions content={content} actions={actions} />} />
    );
}

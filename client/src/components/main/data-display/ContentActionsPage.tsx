import Box from "@mui/material/Box";
import { Drawer } from "@mui/material";
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
                    marginRight: `${drawerWidth}px`,
                    transition: 'margin-right 0.3s',
                }}
            >
                <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', height: '100%', mb: 4}}>
                    {content}
                </Box>
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
                <Box sx={{ p: 2, overflowY: 'auto', mb: 10 }}>
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

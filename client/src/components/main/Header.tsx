import React from "react";
import {
    AppBar,
    Toolbar,
    Button,
    IconButton,
    Menu,
    MenuItem, Box,
} from "@mui/material";
import { AccountCircle, Language } from "@mui/icons-material";

export const Header = () => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [languageAnchorEl, setLanguageAnchorEl] = React.useState(null);

    const handleMenuOpen = (event: any) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLanguageMenuOpen = (event: any) => {
        setLanguageAnchorEl(event.currentTarget);
    };

    const handleLanguageMenuClose = () => {
        setLanguageAnchorEl(null);
    };

    return (
        <AppBar position="static" sx={{mb: 2}}>
            <Toolbar>
                <Box sx={{display: 'flex', justifyContent: 'space-between', width: '100%'}}>
                    <Box>
                        <Button color="inherit" onClick={handleMenuOpen}>
                            Sign In
                        </Button>
                        <Button color="inherit">Sign Up</Button>
                    </Box>
                    <Box>
                        <IconButton
                            color="inherit"
                            onClick={handleLanguageMenuOpen}
                            edge="end"
                        >
                            <Language />
                        </IconButton>
                        <Menu
                            anchorEl={languageAnchorEl}
                            open={Boolean(languageAnchorEl)}
                            onClose={handleLanguageMenuClose}
                        >
                            <MenuItem onClick={handleLanguageMenuClose}>English</MenuItem>
                            <MenuItem onClick={handleLanguageMenuClose}>Русский</MenuItem>
                            {/* Add more language options here */}
                        </Menu>
                    </Box>
                </Box>
            </Toolbar>
        </AppBar>
    );
};


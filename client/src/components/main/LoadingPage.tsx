import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

export const LoadingPage = () => {
    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="100vh"
            width="100vw"
            position="fixed"
            top={0}
            left={0}
            bgcolor="rgba(255, 255, 255, 0.8)"
            zIndex={1300}
        >
            <CircularProgress />
        </Box>
    );
}

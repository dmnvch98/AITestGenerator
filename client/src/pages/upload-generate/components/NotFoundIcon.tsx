import React from 'react';
import { Box, Typography } from '@mui/material';
import SearchOffOutlinedIcon from '@mui/icons-material/SearchOffOutlined';

export const NotFoundIcon: React.FC = () => {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                p: 2,
                color: '#444'
            }}
        >
            <SearchOffOutlinedIcon sx={{ fontSize: 72, mb: 1 }}/>
            <Typography variant="subtitle2">
                Данные не найдены
            </Typography>
        </Box>
    );
};

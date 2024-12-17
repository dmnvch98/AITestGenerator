import React from 'react';
import CircularProgress, { CircularProgressProps } from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

interface CircularProgressWithLabelProps extends CircularProgressProps {
    value: number;
}

// Стрелочная функция для компонента CircularProgressWithLabel
const CircularProgressWithLabel = ({ value, ...props }: CircularProgressWithLabelProps) => (
    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
        <CircularProgress variant="determinate" {...props} value={value} />
        <Box
            sx={{
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                position: 'absolute',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <Typography variant="caption" component="div" sx={{ color: 'text.secondary' }}>
                {`${Math.round(value)}%`}
            </Typography>
        </Box>
    </Box>
);

export default CircularProgressWithLabel;

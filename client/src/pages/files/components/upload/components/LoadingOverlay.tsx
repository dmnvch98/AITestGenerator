import React from 'react';
import { Box, CircularProgress } from '@mui/material';

interface LoadingOverlayProps {
    isUploading: boolean;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ isUploading }) => (
    <>
        {isUploading && (
            <Box
                sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    opacity: '50%',
                    backgroundColor: '#fff',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 1,
                }}
            >
                <CircularProgress color="inherit" />
            </Box>
        )}
    </>
);

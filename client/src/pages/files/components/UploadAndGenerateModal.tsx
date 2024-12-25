import React, { useState } from 'react';
import {
    Box,
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton,
    Typography,
    Stepper,
    Step,
    StepLabel,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { FileUploadModal } from './FileUploadModal';
import { GenTestModal } from "../../../components/tests/GenTestModal"; // Убедитесь, что путь верный

interface UploadAndGenerateModalProps {
    open: boolean;
    onClose: () => void;
}

const steps = ['Загрузка файла', 'Параметры генерации'];

export const UploadAndGenerateModal: React.FC<UploadAndGenerateModalProps> = ({ open, onClose }) => {
    const [activeStep, setActiveStep] = useState<number>(0);
    const [generationParams, setGenerationParams] = useState<Record<string, any> | null>(null);

    const handleUploadSuccess = () => {
        setActiveStep((prev) => prev + 1);
    };

    const handleGenerationSubmit = (params: Record<string, any>) => {
        setGenerationParams(params);
        console.log('Параметры генерации:', params);
        onClose();
    };

    const handleClose = () => {
        setActiveStep(0);
        setGenerationParams(null);
        onClose();
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: {
                    height: '90vh',
                },
            }}
        >
            <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="h6">Загрузка и генерация</Typography>
                <IconButton onClick={handleClose}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent sx={{ height: '100%', overflowY: 'auto' }}>
                <Stepper activeStep={activeStep} alternativeLabel sx={{position: 'static'}}>
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>
                <Box sx={{ mt: 4 }}>
                    {activeStep === 0 && (
                        <FileUploadModal
                            onUploadSuccess={handleUploadSuccess}
                        />
                    )}
                    {activeStep === 1 && (
                        <GenTestModal
                            open={true}
                            onClose={handleClose}
                            onSubmit={handleGenerationSubmit}
                        />
                    )}
                </Box>
            </DialogContent>
            {/*<DialogActions sx={{ p: 2 }}>*/}
            {/*    <Button onClick={() => {}} variant="outlined">*/}
            {/*        Далее*/}
            {/*    </Button>*/}
            {/*</DialogActions>*/}
        </Dialog>
    );
};

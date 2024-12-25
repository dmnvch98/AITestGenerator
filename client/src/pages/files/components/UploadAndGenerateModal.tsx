import React, {useMemo, useState} from 'react';
import {
    Box,
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton,
    Step,
    StepLabel,
    Stepper,
    Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import {FileUploadModal} from './FileUploadModal';
import {GenTestModal} from "../../../components/tests/GenTestModal";
import DialogActions from "@mui/material/DialogActions";
import useFileStore from "../store/fileStore";
import {GenerateTestRequest, QuestionType} from "../../../store/tests/types";
import {useTestStore} from "../../../store/tests/testStore";
import {useUserStore} from "../../../store/userStore";

interface UploadAndGenerateModalProps {
    open: boolean;
    onClose: () => void;
}

const steps = ['Загрузка файла', 'Параметры генерации'];

export const UploadAndGenerateModal: React.FC<UploadAndGenerateModalProps> = ({ open, onClose }) => {

    const { filesToUpload, uploadFiles } = useFileStore();
    const { generateTestByFile } = useTestStore();
    const { getTestGenCurrentActivities } = useUserStore();
    const [upload, setUpload] = useState(false);
    const [activeStep, setActiveStep] = useState<number>(0);
    const [fileHash, setFileHash] = useState<string>('');

    const [selection, setSelection] = useState<Record<QuestionType, { selected: boolean; maxQuestions: number }>>(
        Object.keys(QuestionType).reduce((acc, key) => {
            acc[key as unknown as QuestionType] = { selected: false, maxQuestions: 10 };
            return acc;
        }, {} as Record<QuestionType, { selected: boolean; maxQuestions: number }>)
    );

    const isGenerateButtonDisabled = useMemo(() => {
        console.log('isGenerateButtonDisabled');
        return !Object.values(selection).some(item => item.selected);
    }, [selection]);

    const handleUploadSuccess = () => {
        setActiveStep((prev) => prev + 1);
    };

    const handleNext = async () => {
        setUpload(true);
        try {
            const { success, fileHash } = await uploadFiles();
            if (success) {
                fileHash && setFileHash(fileHash);
                handleUploadSuccess();
            }
        } finally {
            setUpload(false);
        }
    };

    const handleGenerationSubmit = () => {
        console.log('fileHash: ', fileHash)
        if (fileHash) {
            const params = Object.entries(selection)
                .filter(([_, value]) => value.selected)
                .map(([key, value]) => ({
                    questionType: key as unknown as QuestionType,
                    maxQuestions: value.maxQuestions,
                }));

            const request: GenerateTestRequest = {
                hashedFileName: fileHash,
                params: params,
            };

            console.log('request: ', request);

            generateTestByFile(request);
            getTestGenCurrentActivities();
            onClose();
        }
    };

    const handleClose = () => {
        setActiveStep(0);
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
                            upload={upload}
                        />
                    )}
                    {activeStep === 1 && (
                        <GenTestModal
                            selection={selection}
                            setSelection={setSelection}
                            open={true}
                            onClose={handleClose}
                        />
                    )}
                </Box>
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
                {activeStep === 0 &&
                    <Button
                        sx={{width: '30%'}}
                        variant="contained"
                        color="primary"
                        onClick={handleNext}
                        disabled={filesToUpload.length === 0 || upload}
                    >
                        Дальше
                    </Button>
                }
                {activeStep === 1 &&
                    <Button
                        sx={{width: '30%'}}
                        onClick={handleGenerationSubmit}
                        variant="contained"
                        color="primary"
                        disabled={isGenerateButtonDisabled}
                    >
                        Сгенерировать
                    </Button>
                }
            </DialogActions>
        </Dialog>
    );
};

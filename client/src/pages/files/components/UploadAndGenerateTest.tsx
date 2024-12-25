import React, { useState, useMemo } from 'react';
import {Box, Stepper, Step, StepLabel, Button, Typography, Container} from '@mui/material';
import { FileUploadModal } from './FileUploadModal';
import { GenTestModal } from '../../../components/tests/GenTestModal';
import useFileStore from '../store/fileStore';
import { GenerateTestRequest, QuestionType } from '../../../store/tests/types';
import { useTestStore } from '../../../store/tests/testStore';
import {LoggedInUserPage} from "../../../components/main/LoggedInUserPage";
import {useNavigate} from "react-router-dom";
import NotificationService from "../../../services/notification/AlertService";
import {AlertMessage} from "../../../store/types";

const steps = ['Загрузка файла', 'Параметры генерации'];

export const UploadAndGenerateTestContent: React.FC = () => {
    const navigate = useNavigate();
    const { filesToUpload, uploadFiles, uploaded } = useFileStore();
    const { generateTestByFile } = useTestStore();
    const [isFileUploading, setIsFileUploading] = useState(false);
    const [isGenerationQueueing, setIsGenerationQueueing] = useState(false);
    const [activeStep, setActiveStep] = useState<number>(0);
    const [fileHash, setFileHash] = useState<string>('');
    const [selection, setSelection] = useState<Record<QuestionType, { selected: boolean; maxQuestions: number }>>(
        Object.keys(QuestionType).reduce((acc, key) => {
            acc[key as unknown as QuestionType] = { selected: false, maxQuestions: 10 };
            return acc;
        }, {} as Record<QuestionType, { selected: boolean; maxQuestions: number }>)
    );

    const isGenerateButtonDisabled = useMemo(() => {
        return !Object.values(selection).some(item => item.selected);
    }, [selection]);

    const handleNext = async () => {
        setIsFileUploading(true);
        try {
            if (!uploaded) {
                const { success, fileHash } = await uploadFiles();
                if (success) {
                    fileHash && setFileHash(fileHash);
                }
            }
            setActiveStep((prev) => prev + 1);
        } finally {
            setIsFileUploading(false);
        }
    };

    const handleGenerationSubmit = async () => {
        if (fileHash) {
            setIsGenerationQueueing(true);
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

            const isSuccess = await generateTestByFile(request);
            setIsGenerationQueueing(false);

            if (isSuccess) {
                navigate('/tests?activeTab=history');
                NotificationService.addAlert(new AlertMessage(`Файл <b>${request.originalFileName}</b> добавлен в очередь`, 'success'));
            } else {
                NotificationService.addAlert(new AlertMessage(`Ошибка при добавлении <b>${request.originalFileName}</b> в очередь. Пожалуйста, попробуйте позже.`, 'error'));
            }
        }
    };

    return (
        <Box>
            <Typography variant="h5" align="left" sx={{mb: 1}}>
                Генерация теста
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Stepper activeStep={activeStep} sx={{ width: '50%' }}>
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>
            </Box>
            <Container maxWidth="md">
                <Box sx={{mt: 4, height: '60vh'}}>
                    {activeStep === 0 && <FileUploadModal isUploading={isFileUploading}/>}
                    {activeStep === 1 && (
                        <GenTestModal
                            selection={selection}
                            setSelection={setSelection}
                            open={true}
                            onClose={() => setActiveStep(0)}
                            isQueueing={isGenerationQueueing}
                        />
                    )}
                </Box>
                <Box sx={{display: 'flex', justifyContent: 'flex-end', mt: 4}}>
                    <Box sx={{display: 'flex', gap: 2}}>
                        {activeStep > 0 && (
                            <Button
                                onClick={() => setActiveStep((prev) => prev - 1)}
                                variant="outlined"
                                sx={{minWidth: '150px'}}
                            >
                                Назад
                            </Button>
                        )}
                        {activeStep === 0 && (
                            <Button
                                variant="contained"
                                onClick={handleNext}
                                disabled={(filesToUpload.length === 0 || isFileUploading)}
                                sx={{minWidth: '150px'}}
                            >
                                Дальше
                            </Button>
                        )}
                        {activeStep === 1 && (
                            <Button
                                variant="contained"
                                onClick={handleGenerationSubmit}
                                disabled={isGenerateButtonDisabled}
                                sx={{minWidth: '150px'}}
                            >
                                Сгенерировать
                            </Button>
                        )}
                    </Box>
                </Box>
            </Container>

        </Box>
    );
};

export const UploadAndGenerateTest = () => {
    return <LoggedInUserPage mainContent={<UploadAndGenerateTestContent/>}/>;
};

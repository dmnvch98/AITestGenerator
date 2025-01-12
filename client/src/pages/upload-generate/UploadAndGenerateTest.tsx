// UploadAndGenerateTestContent.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Box, Button, Container, Fade, Step, StepLabel, Stepper, Typography } from '@mui/material';
import { FileUploader } from './components/FileUploader';
import { GenTestParams } from '../../components/tests/GenTestParams';
import { LoggedInUserPage } from "../../components/main/LoggedInUserPage";
import { useNavigate } from "react-router-dom";
import { FileAlreadyUploadedModal } from "../files/components/upload/components/FileAlreadyUploadedModal";
import { TabItem, TabsPanel } from "../../components/main/tabsPanel/TabsPanel";
import { InfinityScrollGrid } from "./components/DataSearchGrid";
import useFileStore from "../files/store/fileStore";
import { FileDto, UploadStatus } from "../files/types";
import { useIncidentStore } from "../../store/alerts/alertStore";
import useUploadGenerateStore from "./uploadGenerateStore";

const steps = ['Выбор файла', 'Параметры генерации'];

export const UploadAndGenerateTestContent: React.FC = () => {
    const navigate = useNavigate();
    const {
        getUserFiles,
        totalPages,
        totalUserFiles,
    } = useFileStore();

    const {
        selectedFile,
        setSelectedFile,
        isUploading,
        isFileExists,
        filesToUpload,
        uploadUserFiles,
        confirmUpload,
        generateTestByFile,
        selection,
        setSelection,
        isGenerationQueueing,
        uploadEnabled
    } = useUploadGenerateStore();

    const { getIsIncidentExists, isIncidentExists } = useIncidentStore();

    const [activeStep, setActiveStep] = useState<number>(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isExiting, setIsExiting] = useState(false);
    const [fileUploadActiveTab, setFileUploadActiveTab] = useState(0);

    useEffect(() => {
        getIsIncidentExists();
    }, [getIsIncidentExists]);

    const isUploadButtonDisabled = useMemo(() => {
        return !uploadEnabled || isUploading;
    }, [uploadEnabled, isUploading]);

    const isGenerateButtonDisabled = useMemo(() => {
        return !Object.values(selection).some(item => item.selected) || isGenerationQueueing;
    }, [selection, isGenerationQueueing]);

    const handleFileUpload = async () => {
        if (filesToUpload.length > 0) {
            const { exists} = await isFileExists(filesToUpload[0].name);
            if (exists) {
                setIsModalOpen(true);
                return;
            }
            const { status } = await uploadUserFiles();
            if (status === UploadStatus.SUCCESS) {
                setActiveStep((prev) => prev + 1);
            }
        } else if (selectedFile) {
            setActiveStep((prev) => prev + 1);
        }
    };

    const handleOverride = async () => {
        setIsModalOpen(false);
        const status = await confirmUpload({ overwrite: true });
        if (status === UploadStatus.SUCCESS) {
            setActiveStep((prev) => prev + 1);
        }
    };

    const handleCreateCopy = async () => {
        setIsModalOpen(false);
        const status = await confirmUpload({ createCopy: true });
        if (status === UploadStatus.SUCCESS) {
            setActiveStep((prev) => prev + 1);
        }
    };

    const handleGenerationSubmit = async () => {
        const isSuccess = await generateTestByFile();

        if (isSuccess) {
            setIsExiting(true);
            setTimeout(() => {
                navigate('/tests?activeTab=history');
            }, 300);
        }
    };

    const handleFileSelect = (file: FileDto) => {
        setSelectedFile(file);
    };

    const tabs: TabItem[] = [
        {
            index: 0,
            value: 0,
            children: <Box><FileUploader isUploading={isUploading} /></Box>,
            title: 'Загрузить файл'
        },
        {
            index: 1,
            value: 1,
            children: <Box>
                <InfinityScrollGrid
                    onSelect={handleFileSelect}
                    fetchData={getUserFiles}
                    totalPages={totalPages}
                    totalElements={totalUserFiles}
                    selectedItemId={selectedFile?.id}
                />
            </Box>,
            title: 'Выбрать существующий'
        },
    ];

    return (
        <Fade in={!isExiting} timeout={300}>
            <Box sx={{
                height: '80vh',
                display: 'flex',
                flexDirection: 'column',
            }}>
                <Typography variant="h5" align="left" sx={{ mb: 1 }}>
                    Генерация теста
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Stepper activeStep={activeStep} sx={{ width: '50%' }}>
                        {steps.map((label) => (
                            <Step key={label}>
                                <StepLabel>{label}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                </Box>
                <Container maxWidth="md">
                    {isIncidentExists &&
                        <Box sx={{ mt: 2 }}>
                            <Alert severity="error" icon={false}>
                                <Typography variant="body2" gutterBottom>
                                    Возможны временные проблемы с генерацией теста из-за неполадок в работе ИИ.
                                </Typography>
                            </Alert>
                        </Box>
                    }
                    <Box sx={{ mt: 4, height: '60vh' }}>
                        {activeStep === 0
                            && <TabsPanel tabs={tabs} activeTab={fileUploadActiveTab}
                                          onTabChange={setFileUploadActiveTab} />
                        }
                        {activeStep === 1 && (
                            <GenTestParams
                                selection={selection}
                                setSelection={setSelection}
                                open={true}
                                selectedFileName={selectedFile?.originalFilename}
                                onClose={() => setActiveStep(0)}
                            />
                        )}
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            {activeStep > 0 && (
                                <Button
                                    onClick={() => setActiveStep((prev) => prev - 1)}
                                    variant="outlined"
                                    sx={{ minWidth: '150px' }}
                                >
                                    Назад
                                </Button>
                            )}
                            {activeStep === 0 && (
                                <Button
                                    variant="contained"
                                    onClick={handleFileUpload}
                                    disabled={isUploadButtonDisabled}
                                    sx={{ minWidth: '150px' }}
                                >
                                    Дальше
                                </Button>
                            )}
                            {activeStep === 1 && (
                                <Button
                                    variant="contained"
                                    onClick={handleGenerationSubmit}
                                    disabled={isGenerateButtonDisabled}
                                    sx={{ minWidth: '150px' }}
                                >
                                    Сгенерировать
                                </Button>
                            )}
                        </Box>
                    </Box>
                </Container>

                <FileAlreadyUploadedModal
                    open={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onOverride={handleOverride}
                    onCreateCopy={handleCreateCopy}
                />
            </Box>
        </Fade>
    );
};

export const UploadAndGenerateTest = () => {
    return <LoggedInUserPage mainContent={<UploadAndGenerateTestContent />} />;
};

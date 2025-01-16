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
import { FileDto } from "../files/types";
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
        validateAndUploadUserFile,
        activeStep,
        setActiveStep,
        generateTestByFile,
        selection,
        setSelection,
        isGenerationQueueing,
        fileUploadActiveTab,
        setFileUploadActiveTab,
        uploadEnabled,
        fileUploadConfirmModal,
        setFileUploadConfirmModal,
        confirmUpload
    } = useUploadGenerateStore();

    const { getIsIncidentExists, isIncidentExists } = useIncidentStore();
    const [isExiting, setIsExiting] = useState(false);

    useEffect(() => {
        getIsIncidentExists();
    }, [getIsIncidentExists]);

    const isUploadButtonDisabled = useMemo(() => {
        return !uploadEnabled || isUploading ;
    }, [uploadEnabled, isUploading]);

    const isGenerateButtonDisabled = useMemo(() => {
        return !Object.values(selection).some(item => item.selected) || isGenerationQueueing;
    }, [selection, isGenerationQueueing]);

    const handleNextStep = async () => {
        if (activeStep === 0) {
            if (selectedFile) {
                setActiveStep(1);
            } else {
                await validateAndUploadUserFile();
            }
        }
    }

    const handleOverride = async () => {
        await confirmUpload({ overwrite: true });
    };

    const handleCreateCopy = async () => {
        await confirmUpload({ createCopy: true });
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
                <Container
                    maxWidth="md"
                    sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center'
                    }}
                >
                    {isIncidentExists &&
                        <Box sx={{ mt: 2 }}>
                            <Alert severity="error" icon={false}>
                                <Typography variant="body2" gutterBottom>
                                    Возможны временные проблемы с генерацией теста из-за неполадок в работе ИИ.
                                </Typography>
                            </Alert>
                        </Box>
                    }
                    <Box sx={{ mt: 2, height: '60vh' }}>
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
                                isQueueing={isGenerationQueueing}
                                onClose={() => setActiveStep(0)}
                            />
                        )}
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            {activeStep > 0 && (
                                <Button
                                    onClick={() => setActiveStep(activeStep - 1)}
                                    variant="outlined"
                                    sx={{ minWidth: '150px' }}
                                >
                                    Назад
                                </Button>
                            )}
                            {activeStep === 0 && (
                                <Button
                                    variant="contained"
                                    onClick={handleNextStep}
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
                    open={fileUploadConfirmModal}
                    onClose={() => setFileUploadConfirmModal(false)}
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

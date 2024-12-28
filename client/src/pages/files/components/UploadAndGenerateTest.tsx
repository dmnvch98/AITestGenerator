import React, {useMemo, useState} from 'react';
import {Box, Button, Container, Fade, Step, StepLabel, Stepper, Typography} from '@mui/material';
import {FileUploadModal} from './FileUploadModal';
import {GenTestModal} from '../../../components/tests/GenTestModal';
import useFileStore, {FileDto, UploadStatus} from '../store/fileStore';
import {GenerateTestRequest, QuestionType} from '../../../store/tests/types';
import {useTestStore} from '../../../store/tests/testStore';
import {LoggedInUserPage} from "../../../components/main/LoggedInUserPage";
import {useNavigate} from "react-router-dom";
import NotificationService from "../../../services/notification/AlertService";
import {AlertMessage} from "../../../store/types";
import {FileAlreadyUploadedModal} from "./upload/components/FileAlreadyUploadedModal";
import {TabItem, TabsPanel} from "../../../components/main/tabsPanel/TabsPanel";
import {InfinityScrollGrid} from "./DataSearchGrid";

const steps = ['Выбор файла', 'Параметры генерации'];

export const UploadAndGenerateTestContent: React.FC = () => {
    const navigate = useNavigate();
    const {filesToUpload, uploadFiles} = useFileStore();
    const {generateTestByFile} = useTestStore();
    const {
        getFiles,
        totalPages,
        totalUserFiles,
        selectedFile,
        setSelectedFile,
        isLoading,
        setIsLoading,
        isFileExists
    } = useFileStore();
    const [isGenerationQueueing, setIsGenerationQueueing] = useState(false);
    const [activeStep, setActiveStep] = useState<number>(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isExiting, setIsExiting] = useState(false);
    const [fileUploadActiveTab, setFileUploadActiveTab] = useState(0);


    const [selection, setSelection] = useState<Record<QuestionType, { selected: boolean; maxQuestions: number }>>(
        Object.keys(QuestionType).reduce((acc, key) => {
            acc[key as unknown as QuestionType] = {selected: false, maxQuestions: 10};
            return acc;
        }, {} as Record<QuestionType, { selected: boolean; maxQuestions: number }>)
    );

    const isUploadButtonDisabled = useMemo(() => {
        return filesToUpload.length === 0 && (isLoading || !selectedFile);
    }, [filesToUpload, isLoading, selectedFile]);

    const isGenerateButtonDisabled = useMemo(() => {
        return !Object.values(selection).some(item => item.selected) || isGenerationQueueing;
    }, [selection]);

    const handleFileUpload = async () => {
        setIsLoading(true);
        try {
            if (filesToUpload.length > 0) {
                const { exists } = await isFileExists(filesToUpload[0].name);
                if (exists) {
                    setIsModalOpen(true);
                    return;
                }
                const {status} = await uploadFiles();
                if (status === UploadStatus.SUCCESS) {
                    setActiveStep((prev) => prev + 1);
                }
            } else if (selectedFile) {
                setActiveStep((prev) => prev + 1);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleOverride = async () => {
        setIsLoading(true);
        setIsModalOpen(false);
        const {status} = await uploadFiles({ override: true });
        if (status === UploadStatus.SUCCESS) {
            setActiveStep((prev) => prev + 1);
        }
    };

    const handleCreateCopy = async () => {
        setIsLoading(true);
        setIsModalOpen(false);
        const {status} = await uploadFiles({createCopy: true });
        if (status === UploadStatus.SUCCESS) {
            setActiveStep((prev) => prev + 1);
        }
    };

    const handleGenerationSubmit = async () => {
        if (selectedFile) {
            setIsGenerationQueueing(true);
            const params = Object.entries(selection)
                .filter(([_, value]) => value.selected)
                .map(([key, value]) => ({
                    questionType: key as unknown as QuestionType,
                    maxQuestions: value.maxQuestions,
                }));

            const request: GenerateTestRequest = {
                hashedFileName: selectedFile.hashedFilename,
                params: params,
            };

            const isSuccess = await generateTestByFile(request);
            setIsGenerationQueueing(false);

            if (isSuccess) {
                setIsExiting(true);
                setTimeout(() => {
                    navigate('/tests?activeTab=history');
                }, 300);
                setTimeout(() => {
                    NotificationService.addAlert(new AlertMessage('Генерация теста начата', 'success'));
                }, 500);
            } else {
                NotificationService.addAlert(new AlertMessage(`Ошибка при добавлении <b>${request.originalFileName}</b> в очередь. Пожалуйста, попробуйте позже.`, 'error'));
            }
        }
    };

    const handleFileSelect = (file: FileDto) => {
        setSelectedFile(file);
    };

    const tabs: TabItem[] = [
        {
            index: 0,
            value: 0,
            children: <Box><FileUploadModal isUploading={isLoading}/></Box>,
            title: 'Загрузить файл'
        },
        {
            index: 1,
            value: 1,
            children: <Box>
                <InfinityScrollGrid
                    onSelect={handleFileSelect}
                    fetchData={getFiles}
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
                <Typography variant="h5" align="left" sx={{mb: 1}}>
                    Генерация теста
                </Typography>
                <Box sx={{display: 'flex', justifyContent: 'center'}}>
                    <Stepper activeStep={activeStep} sx={{width: '50%'}}>
                        {steps.map((label) => (
                            <Step key={label}>
                                <StepLabel>{label}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                </Box>
                <Container maxWidth="md">
                    <Box sx={{mt: 4, height: '60vh'}}>
                        {activeStep === 0
                            && <TabsPanel tabs={tabs} activeTab={fileUploadActiveTab}
                                          onTabChange={setFileUploadActiveTab}/>
                        }
                        {activeStep === 1 && (
                            <GenTestModal
                                selection={selection}
                                setSelection={setSelection}
                                open={true}
                                selectedFileName={selectedFile?.originalFilename}
                                onClose={() => setActiveStep(0)}
                            />
                        )}
                    </Box>
                    {/*<Divider/>*/}
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
                                    onClick={handleFileUpload}
                                    disabled={isUploadButtonDisabled}
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
    return <LoggedInUserPage mainContent={<UploadAndGenerateTestContent/>}/>;
};

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
import {ServerDataGridWithRadio} from "./FilesAutocomplete";

const steps = ['Загрузка файла', 'Параметры генерации'];

export const UploadAndGenerateTestContent: React.FC = () => {
    const navigate = useNavigate();
    const {filesToUpload, uploadFiles, uploaded, addFiles} = useFileStore();
    const {generateTestByFile} = useTestStore();
    const { getFiles, fileDtos } = useFileStore();
    const [isFileUploading, setIsFileUploading] = useState(false);
    const [isGenerationQueueing, setIsGenerationQueueing] = useState(false);
    const [activeStep, setActiveStep] = useState<number>(0);
    const [fileHash, setFileHash] = useState<string>('');
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
        return filesToUpload.length === 0 && (isFileUploading || fileHash === '');
    }, [filesToUpload, isFileUploading, fileHash]);

    const isGenerateButtonDisabled = useMemo(() => {
        return !Object.values(selection).some(item => item.selected) || isGenerationQueueing;
    }, [selection]);

    const handleFileUpload = async () => {
        setIsFileUploading(true);
        try {
            if (!uploaded) {
                if (filesToUpload.length > 1) {
                    const {status, fileHash} = await uploadFiles();
                    if (status === UploadStatus.SUCCESS) {
                        fileHash && setFileHash(fileHash);
                        setActiveStep((prev) => prev + 1);
                    } else if (status === UploadStatus.ALREADY_UPLOADED) {
                        setIsModalOpen(true);
                    }
                } else if (Boolean(fileHash)) {
                    setActiveStep((prev) => prev + 1);
                }
            } else {
                setActiveStep((prev) => prev + 1);
            }
        } finally {
            setIsFileUploading(false);
        }
    };

    const handleOverride = async () => {
        setIsFileUploading(true);
        setIsModalOpen(false);
        const {status, fileHash} = await uploadFiles(true, false);
        if (status === UploadStatus.SUCCESS) {
            fileHash && setFileHash(fileHash);
            setActiveStep((prev) => prev + 1);
        }
    };

    const handleCreateCopy = async () => {
        setIsFileUploading(true);
        setIsModalOpen(false);
        const {status, fileHash} = await uploadFiles(false, true);
        if (status === UploadStatus.SUCCESS) {
            fileHash && setFileHash(fileHash);
            setActiveStep((prev) => prev + 1);
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
        setFileHash(file.hashedFilename);
    };

    const tabs: TabItem[] = [
        {index: 0, value: 0, children: <Box><FileUploadModal isUploading={isFileUploading}/></Box>, title: 'Загрузить файл'},
        {
            index: 1,
            value: 1,
            children: <Box> <ServerDataGridWithRadio onFileSelect={handleFileSelect} fetchFiles={getFiles} files={fileDtos}/>
            </Box>,
            title: 'Выбрать существиющий'
        },
    ];

    return (
        <Fade in={!isExiting} timeout={300}>

            <Box>
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
                            && <TabsPanel tabs={tabs} activeTab={fileUploadActiveTab} onTabChange={setFileUploadActiveTab}/>
                        }
                        {activeStep === 1 && (
                            <GenTestModal
                                selection={selection}
                                setSelection={setSelection}
                                open={true}
                                onClose={() => setActiveStep(0)}
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

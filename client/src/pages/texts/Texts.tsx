import {useTextStore} from "../../store/textStore";
import {Alert, Box, Button, IconButton, Modal, Snackbar} from "@mui/material";
import {useEffect} from "react";
import {LoggedInUserPage} from "../../components/main/LoggedInUserPage";
import {TextTable} from "../../components/texts/TextTable";
import Typography from "@mui/material/Typography";
import {useTestStore} from "../../store/tests/testStore";
import {GenerateTestAskGroup} from "../../components/tests/GenerateTestAskGroup";
import CloseIcon from "@mui/icons-material/Close";


const ChaptersContent = () => {
    const textSavedFlag: boolean = useTextStore(state => state.textSavedFlag);
    const textDeletedFlag: boolean = useTextStore(state => state.textDeletedFlag);
    const toggleTextSavedFlag = useTextStore(state => state.toggleTextSavedFlag);
    const toggleTextDeletedFlag = useTextStore(state => state.toggleTextDeletedFlag);
    const generateTestFlag = useTestStore(state => state.generateTestFlag);
    const toggleGenerateTestFlag = useTestStore(state => state.toggleGenerateTestFlag);
    const generateTest = useTestStore(state => state.generateTest);
    const selectedTextId = useTestStore(state => state.selectedTextId);
    const generateTestValidationErrorFlag = useTestStore(state => state.generateTestValidationErrorFlag);

    const getTexts = useTextStore(state => state.getTexts);

    useEffect(() => {
        getTexts();
    }, [])

    const handleGenerateTestClick = () => {
        generateTest(selectedTextId as number)
        toggleGenerateTestFlag()
    }

    const style = {
        position: 'absolute' as 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    };

    const closeButtonStyle = {
        position: 'absolute',
        top: 0,
        right: 0,
    };

    return (
        <>
            <Typography variant="h5" align="left" sx={{mb: 2}}>
                Saved Texts
            </Typography>

            <Box>
                <TextTable/>
            </Box>

            <Snackbar
                open={textSavedFlag}
                autoHideDuration={3000}
                onClose={toggleTextSavedFlag}
            >
                <Alert severity="success">
                    Chapter successfully saved
                </Alert>
            </Snackbar>

            <Snackbar
                open={textDeletedFlag}
                autoHideDuration={3000}
                onClose={toggleTextDeletedFlag}
            >
                <Alert severity="success">
                    Chapter(s) successfully deleted
                </Alert>
            </Snackbar>
            <Modal
                open={generateTestFlag}
                onClose={toggleGenerateTestFlag}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <IconButton
                        onClick={toggleGenerateTestFlag}
                        sx={closeButtonStyle}
                    >
                        <CloseIcon/>
                    </IconButton>
                    <GenerateTestAskGroup/>
                    <Box sx={{display: 'flex', justifyContent: 'flex-end'}}>
                        <Button onClick={handleGenerateTestClick}
                                variant="contained"
                                sx={{mt: 2}}
                                disabled={generateTestValidationErrorFlag}>
                            Generate
                        </Button>
                    </Box>
                </Box>
            </Modal>

        </>
    )
}

export const Texts = () => {
    return <LoggedInUserPage mainContent={<ChaptersContent/>}/>;
}
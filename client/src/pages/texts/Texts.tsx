import {useTextStore} from "../../store/textStore";
import {Alert, Box, Snackbar} from "@mui/material";
import {useEffect} from "react";
import {LoggedInUserPage} from "../../components/main/LoggedInUserPage";
import {TextTable} from "../../components/texts/TextTable";

const ChaptersContent = () => {
    const textSavedFlag: boolean = useTextStore(state => state.textSavedFlag);
    const textDeletedFlag: boolean = useTextStore(state => state.textDeletedFlag);
    const toggleTextSavedFlag = useTextStore(state => state.toggleTextSavedFlag);
    const toggleTextDeletedFlag = useTextStore(state => state.toggleTextDeletedFlag);
    const getTexts = useTextStore(state => state.getTexts);

    useEffect(() => {
        getTexts();
    }, [])

    return (
        <>
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
        </>
    )
}

export const Texts = () => {
    return <LoggedInUserPage mainContent={<ChaptersContent/>}/>;
}
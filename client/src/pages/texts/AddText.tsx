import {Alert, Box, Button, Snackbar, TextField} from "@mui/material";
import {useTextStore} from "../../store/textStore";
import {useNavigate} from "react-router-dom";
import React, {useState} from "react";
import {LoggedInUserPage} from "../../components/main/LoggedInUserPage";

export const AddChapterContent = () => {
    const saveChapter = useTextStore(state => state.saveText);
    const setTitle = useTextStore(state => state.setTitle);
    const setContent = useTextStore(state => state.setContent);
    const [unsuccessfulSave, setUnsuccessfulSave] = useState(false);
    const navigate = useNavigate();

    const handleSave = async () => {
        const savedSuccessfully = await saveChapter();
        if (savedSuccessfully) {
            navigate('/texts');
        } else {
            setUnsuccessfulSave(!unsuccessfulSave);
        }
    }

    return (
        <>
            <Box sx={{mt: 2}}>
                <Box>
                    <TextField
                        onChange={(e) => setTitle(e.target.value)}
                        fullWidth
                        label="Title"
                        variant="standard"/>
                </Box>
                <TextField
                    multiline
                    fullWidth
                    variant="outlined"
                    onChange={(e) => setContent(e.target.value)}
                    sx={{mt: 5}}
                    maxRows="20"/>
            </Box>
            <Box sx={{display: 'flex', mt: 2, marginLeft: "auto", width: '50%'}}>
                <Button
                    variant="outlined"
                    sx={{flex: 1, marginRight: 2}}
                    onClick={() => navigate("/texts")}
                >
                    Back to chapters
                </Button>
                <Button
                    variant="contained"
                    sx={{flex: 1}}
                    onClick={handleSave}
                >
                    Save
                </Button>
            </Box>

            <Snackbar
                open={unsuccessfulSave}
                autoHideDuration={3000}
                onClose={() => setUnsuccessfulSave(!unsuccessfulSave)}
            >
                <Alert severity="error">
                    Some error occurred when saving chapter
                </Alert>
            </Snackbar>
        </>
    );
}

export const AddText = () => {
    return <LoggedInUserPage mainContent={<AddChapterContent/>}/>;}
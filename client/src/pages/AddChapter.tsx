import {Alert, Box, Button, Container, Snackbar, TextField} from "@mui/material";
import {useChapterStore} from "../zustand/chapterStore";
import {useNavigate} from "react-router-dom";
import {useState} from "react";

export const AddChapter = () => {
    const saveChapter = useChapterStore(state => state.saveChapter);
    const setTitle = useChapterStore(state => state.setTitle);
    const setContent = useChapterStore(state => state.setContent);
    const [unsuccessfulSave, setUnsuccessfulSave] = useState(false);
    const navigate = useNavigate();

    const handleSave = async () => {
        const savedSuccessfully = await saveChapter();
        if (savedSuccessfully) {
            navigate('/chapters');
        } else {
            setUnsuccessfulSave(!unsuccessfulSave);
        }
    }

    return (
        <Container>
            <Box sx={{mt: 2}}>
                <Box sx={{width: '50%'}}>
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
            <Box sx={{display: 'flex', justifyContent: 'flex-end', mt: 2}}>
                <Button
                    variant="contained"
                    sx={{width:'15%'}}
                    onClick={handleSave}
                >
                    Save</Button>
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
        </Container>
    );
}

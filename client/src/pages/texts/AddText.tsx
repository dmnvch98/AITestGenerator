import {Alert, Box, Button, FormControlLabel, Grid, Snackbar, Switch, TextField} from "@mui/material";
import {useTextStore} from "../../store/textStore";
import {useNavigate} from "react-router-dom";
import React, {useState} from "react";
import {LoggedInUserPage} from "../../components/main/LoggedInUserPage";
import {GenerateTestAskGroup} from "../../components/tests/GenerateTestAskGroup";
import {useTestStore} from "../../store/tests/testStore";

export const AddChapterContent = () => {
    const saveText = useTextStore(state => state.saveText);
    const setTitle = useTextStore(state => state.setTitle);
    const setContent = useTextStore(state => state.setContent);
    const generateTestFlag = useTestStore(state => state.generateTestFlag);
    const toggleGenerateTestFlag = useTestStore(state => state.toggleGenerateTestFlag);
    const generateTest = useTestStore(state => state.generateTest);
    const generateTestValidationErrorFlag = useTestStore(state => state.generateTestValidationErrorFlag);
    const [unsuccessfulSave, setUnsuccessfulSave] = useState(false);
    const navigate = useNavigate();

    const handleSave = async () => {
        await saveText().then(textId => {
            if (textId) {
                if (generateTestFlag) {
                    generateTest(textId);
                }
                navigate('/texts');
            }
            else {
                setUnsuccessfulSave(!unsuccessfulSave);
            }
        });

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
            <Grid container spacing={2} sx={{mt: 2}}>
                <Grid item xs={6} sm={6} sx={{paddingLeft: 0}}>
                    <Box display="flex" flexDirection="column" alignItems="flex-start">
                        <FormControlLabel
                            control={<Switch checked={generateTestFlag} onChange={toggleGenerateTestFlag}/>}
                            label="Generate Test"
                            labelPlacement="start"
                            sx={{mb: 2, marginLeft: 0}}
                        />
                    </Box>

                </Grid>
                <Grid item xs={6} sm={6}>
                    <Box display="flex" justifyContent="flex-end">
                        <Button
                            variant="outlined"
                            onClick={() => navigate("/texts")}
                            sx={{ minWidth: "15vw"}}
                        >
                            Back to chapters
                        </Button>
                        <Button
                            variant="contained"
                            sx={{ minWidth: "15vw", ml: 2}}
                            onClick={handleSave}
                            disabled={generateTestValidationErrorFlag}
                        >
                            Save
                        </Button>
                    </Box>

                </Grid>
            </Grid>


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
    return <LoggedInUserPage mainContent={<AddChapterContent/>}/>;
};

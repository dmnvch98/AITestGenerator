import React from "react";
import {Box, TextField} from "@mui/material";
import {useTextStore} from "../../store/textStore";
import {CkTextEditor} from "../main/CkTextEditor";


export const TextEditor = () => {
    const newTextContent = useTextStore(state => state.newTextContent);
    const newTextTitle = useTextStore(state => state.newTextTitle);
    const setTitle = useTextStore(state => state.setTitle);
    const setContent = useTextStore(state => state.setContent);

    return (
        <>
            <Box sx={{p: 2}}>
                <TextField
                    value={newTextTitle}
                    onChange={(e) => setTitle(e.target.value)}
                    fullWidth
                    variant="standard"
                />
                <Box sx={{mt: 2}}>
                    <CkTextEditor initialText={newTextContent} onTextChange={setContent}/>
                </Box>
            </Box>
        </>
    );
};


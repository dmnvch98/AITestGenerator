import React from "react";
import {Box, TextField} from "@mui/material";
import {useTextStore} from "../../store/textStore";


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
                <TextField
                    value={newTextContent}
                    multiline
                    fullWidth
                    variant="outlined"
                    onChange={(e) => setContent(e.target.value)}
                    sx={{mt: 5}}
                    maxRows={20}
                />
            </Box>
        </>
    );
};


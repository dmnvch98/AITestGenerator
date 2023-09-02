import React from "react";
import {Box, TextField} from "@mui/material";
import {useChapterStore} from "../../zustand/chapterStore";


export const ChapterEditor = () => {
    const newTextContent = useChapterStore(state => state.newTextContent);
    const newChapterTitle = useChapterStore(state => state.newChapterTitle);
    const setTitle = useChapterStore(state => state.setTitle);
    const setContent = useChapterStore(state => state.setContent);

    return (
        <>
            <Box sx={{p: 2}}>
                <TextField
                    value={newChapterTitle}
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


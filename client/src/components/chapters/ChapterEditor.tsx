import React from "react";
import {Button, TextField} from "@mui/material";
import {useChapterStore} from "../../zustand/chapterStore";


export const ChapterEditor = () => {
    const isChapterEditing = useChapterStore(state => state.isChapterEditing);
    const toggleIsChapterEditing = useChapterStore(state => state.toggleIsChapterEditing);
    const newTextContent = useChapterStore(state => state.newTextContent);
    const newChapterTitle = useChapterStore(state => state.newChapterTitle);
    const setTitle = useChapterStore(state => state.setTitle);
    const setContent = useChapterStore(state => state.setContent);
    const updateChapter = useChapterStore(state => state.updateChapter);

    return (
        <>
            <TextField
                disabled={!isChapterEditing}
                value={newChapterTitle}
                onChange={(e) => setTitle(e.target.value)}
                fullWidth
                variant="standard"
            />
            <TextField
                disabled={!isChapterEditing}
                value={newTextContent}
                multiline
                fullWidth
                variant="outlined"
                onChange={(e) => setContent(e.target.value)}
                sx={{mt: 5}}
                maxRows={20}
            />
            <Button
                variant="outlined"
                sx={{width: "15%", display: "block", mr: 2}}
                onClick={toggleIsChapterEditing}
            >
                Cancel
            </Button>
            <Button
                variant="contained"
                sx={{width: "15%", display: "block"}}
                onClick={() => {
                    updateChapter();
                    toggleIsChapterEditing();
                }}
            >
                Save
            </Button>
        </>
    );
};


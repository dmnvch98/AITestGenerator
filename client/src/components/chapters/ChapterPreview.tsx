import React from "react";
import {Box, IconButton, Paper, Typography} from "@mui/material";
import {useChapterStore} from "../../zustand/chapterStore";
import CloseIcon from '@mui/icons-material/Close';

export const ChapterPreview = () => {
    const chapter = useChapterStore(state => state.selectedChapter)
    const clearSelectedChapter = useChapterStore(state => state.clearSelectedChapter)

    if (!chapter) {
        return <div>Select a chapter for preview</div>;
    }
    return (
        <>
            <Box sx={{height: '90vh'}}>
                <Paper sx={{p: 2, pt: 1, height: '90vh', overflow: 'auto'}}>
                    <Box display='flex' justifyContent='space-between'>
                        <Typography align="left" variant="h4">
                            {chapter?.title}
                        </Typography>
                        <IconButton onClick={clearSelectedChapter}>
                            <CloseIcon/>
                        </IconButton>
                    </Box>

                    <Box sx={{mt: 5}}>
                        <Typography align="left">
                            {chapter?.text.content}
                        </Typography>
                    </Box>
                </Paper>
            </Box>
        </>
    )
}
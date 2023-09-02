import {Box, Paper, Typography} from "@mui/material";
import React from "react";
import {useChapterStore} from "../../zustand/chapterStore";

export const ChapterViewer = () => {
    const chapter = useChapterStore((state) => state.selectedChapter);

    return (
        <>
            <Paper sx={{p: 2}}>
                <Box>
                    <Typography variant='h4' align='left'>{chapter?.title}</Typography>
                </Box>
                <Typography gutterBottom align='left' sx={{mt: 4}}>
                    {chapter?.text.content}
                </Typography>
            </Paper>
        </>
    );
};


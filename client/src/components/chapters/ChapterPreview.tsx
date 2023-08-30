import React from "react";
import {Box, Paper, Typography} from "@mui/material";
import {useChapterStore} from "../../zustand/chapterStore";

export const ChapterPreview = () => {
    const chapter = useChapterStore(state => state.selectedChapterForPreview)

    if (!chapter) {
        return <div>Select a chapter for preview</div>;
    }
        return (
            <>
                <Box sx={{height: '90vh'}}>
                    <Paper sx={{p: 2, pt: 1, height: '90vh', overflow: 'auto'}}>
                        <Typography align="left" variant="h4">
                            {chapter?.title}
                        </Typography>
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
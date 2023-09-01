import {useChapterStore} from "../zustand/chapterStore";
import {ChapterTable} from "../components/chapters/ChapterTable";
import {Alert, Box, Container, Snackbar} from "@mui/material";
import {ChapterPreview} from "../components/chapters/ChapterPreview";
import {useEffect} from "react";

export const Chapters = () => {
    const chapterSavedFlag: boolean = useChapterStore(state => state.chapterSavedFlag);
    const chapterRemovedFlag: boolean = useChapterStore(state => state.chapterDeletedFlag);
    const toggleChapterSavedFlag = useChapterStore(state => state.toggleChapterSavedFlag);
    const toggleChapterDeletedFlag = useChapterStore(state => state.toggleChapterDeletedFlag);
    const getUserChapters = useChapterStore(state => state.getChapters);

    useEffect(() => {
        getUserChapters();
    }, [])

    return (
        <>
            <Container>
                <Box display="flex" justifyContent="space-between" sx={{mt: 2}}>
                    <Box sx={{width: "49%"}}>
                        <ChapterTable/>
                    </Box>
                    <Box sx={{width: "49%"}}>
                        <ChapterPreview/>
                    </Box>
                </Box>

                <Snackbar
                    open={chapterSavedFlag}
                    autoHideDuration={3000}
                    onClose={toggleChapterSavedFlag}
                >
                    <Alert severity="success">
                        Chapter successfully saved
                    </Alert>
                </Snackbar>

                <Snackbar
                    open={chapterRemovedFlag}
                    autoHideDuration={3000}
                    onClose={toggleChapterDeletedFlag}
                >
                    <Alert severity="success">
                        Chapter(s) successfully deleted
                    </Alert>
                </Snackbar>
            </Container>
        </>
    )
}
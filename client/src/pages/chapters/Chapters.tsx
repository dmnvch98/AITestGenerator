import {useChapterStore} from "../../zustand/chapterStore";
import {Alert, Box, Snackbar} from "@mui/material";
import {useEffect} from "react";
import {LoggedInUserPage} from "../../components/main/LoggedInUserPage";
import {ChapterTable} from "../../components/chapters/ChapterTable";

const ChaptersContent = () => {
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
            <Box>
                <ChapterTable/>
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
        </>
    )
}

export const Chapters = () => {
    return <LoggedInUserPage mainContent={<ChaptersContent/>}/>;
}
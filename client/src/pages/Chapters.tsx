import {useChapterStore} from "../zustand/chapterStore";
import {ChapterTable} from "../components/chapters/ChapterTable";
import {Alert, Box, Button, Snackbar} from "@mui/material";
import {ChapterPreview} from "../components/chapters/ChapterPreview";
import {useNavigate} from "react-router-dom";

export const Chapters = () => {
    const chapterSavedFlag: boolean = useChapterStore(state => state.chapterSavedFlag);
    const chapterRemovedFlag: boolean = useChapterStore(state => state.chapterDeletedFlag);
    const toggleChapterSavedFlag = useChapterStore(state => state.toggleChapterSavedFlag);
    const toggleChapterDeletedFlag = useChapterStore(state => state.toggleChapterDeletedFlag);
    const navigate = useNavigate();

    return (
        <>
            <Box display="flex" justifyContent="space-between" sx={{mt: 2}}>
                <Box sx={{width: "49%"}}>
                    <ChapterTable/>
                    <Box display="flex" sx={{mt: 2}}>
                        <Button variant="contained" onClick={() => navigate("/add-chapter")}>
                            Add Chapter
                        </Button>
                    </Box>
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
                    Chapter successfully removed
                </Alert>
            </Snackbar>
        </>
    )
}
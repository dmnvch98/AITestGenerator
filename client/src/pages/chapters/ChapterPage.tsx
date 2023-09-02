import {Alert, Box, Button, Container, Snackbar} from "@mui/material";
import React, {useEffect, useState} from "react";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import {useChapterStore} from "../../zustand/chapterStore";
import {ChapterEditor} from "../../components/chapters/ChapterEditor";
import {ChapterViewer} from "../../components/chapters/ChapterViewer";
import {LoggedInUserPage} from "../../components/main/LoggedInUserPage";

export const ChapterPageContent = () => {
    const {id} = useParams();
    const [isEditing, setIsEditing] = useState(false);

    const chapters = useChapterStore(state => state.chapters);
    const setTitle = useChapterStore(state => state.setTitle);
    const setContent = useChapterStore(state => state.setContent);
    const chapterUpdatedFlag = useChapterStore(state => state.chapterUpdatedFlag);
    const toggleChapterUpdatedFlag = useChapterStore(state => state.toggleChapterUpdatedFlag);
    const getUserChaptersByIdsIn = useChapterStore(state => state.getUserChaptersByIdsIn);
    const selectChapter = useChapterStore(state => state.selectChapter);
    const updateChapter = useChapterStore(state => state.updateChapter);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        if (searchParams.get("edit") === "true") {
            setIsEditing(true);
        }
    }, [location.search]);

    useEffect(() => {
        if (chapters.length === 0) {
            getUserChaptersByIdsIn([Number(id)]).then(() => {
                loadChapterData(Number(id));
            });
        } else {
            loadChapterData(Number(id));
        }
    }, [id, chapters]);

    const loadChapterData = (id: number) => {
        const chapter = chapters.find(ch => ch.id === id);
        if (chapter) {
            selectChapter(chapter);
            setTitle(chapter.title);
            setContent(chapter.text.content);
        }
    };

    return (
        <>
            <Container>
                <Box sx={{display: 'flex', flexDirection: 'column'}}>
                    {isEditing ? <ChapterEditor/> : <ChapterViewer/>}
                    <Box sx={{display: 'flex', mt: 2, marginLeft: "auto", width: '40%'}}>
                        <Button
                            variant="outlined"
                            sx={{flex: 1, marginRight: 2, display: isEditing ? 'none' : 'block'}}
                            onClick={() => navigate("/chapters")}
                        >
                            Back to chapters
                        </Button>
                        <Button
                            variant="contained"
                            sx={{flex: 1, display: isEditing ? 'none' : 'block'}}
                            onClick={() => setIsEditing(!isEditing)}
                        >
                            Edit
                        </Button>
                        <Button
                            variant="outlined"
                            sx={{flex: 1, marginRight: 2, display: isEditing ? 'block' : 'none'}}
                            onClick={() => setIsEditing(!isEditing)}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="contained"
                            sx={{flex: 1, display: isEditing ? 'block' : 'none'}}
                            onClick={() => {
                                updateChapter();
                                setIsEditing(!isEditing)
                            }}
                        >
                            Save
                        </Button>
                    </Box>
                </Box>

                <Snackbar
                    open={chapterUpdatedFlag}
                    autoHideDuration={3000}
                    onClose={toggleChapterUpdatedFlag}
                >
                    <Alert severity="success">
                        Updated
                    </Alert>
                </Snackbar>
            </Container>
        </>
    );
};
export const ChapterPage = () => {
    return <LoggedInUserPage mainContent={<ChapterPageContent/>}/>;
}

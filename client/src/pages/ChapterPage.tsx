import {Alert, Box, Button, Container, Snackbar, TextField, Typography} from "@mui/material";
import React, {useEffect, useState} from "react";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import {useChapterStore} from "../zustand/chapterStore";

export const ChapterPage = () => {
    const {id} = useParams();
    const [isEditing, setIsEditing] = useState(false);

    const chapters = useChapterStore(state => state.chapters);
    const setTitle = useChapterStore(state => state.setTitle);
    const setContent = useChapterStore(state => state.setContent);
    const updateChapter = useChapterStore(state => state.updateChapter);
    const chapterUpdatedFlag = useChapterStore(state => state.chapterUpdatedFlag);
    const toggleChapterUpdatedFlag = useChapterStore(state => state.toggleChapterUpdatedFlag);
    const getUserChaptersByIdsIn = useChapterStore(state => state.getUserChaptersByIdsIn);
    const newTextContent = useChapterStore(state => state.newTextContent);
    const newChapterTitle = useChapterStore(state => state.newChapterTitle);
    const selectChapter = useChapterStore(state => state.selectChapter);
    const chapter = chapters.find(ch => ch.id === Number(id));
    const navigate = useNavigate();
    const location = useLocation();

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
                <Box sx={{mt: 2}}>
                    <Box>
                        {isEditing ?
                            <TextField
                                disabled={!isEditing}
                                value={newChapterTitle}
                                defaultValue={chapter?.title}
                                onChange={(e) => setTitle(e.target.value)}
                                fullWidth
                                variant="standard"/>
                            : <Typography variant='h4' align='left'>{chapter?.title}</Typography>
                        }

                    </Box>
                    {isEditing ?
                        <TextField
                            disabled={!isEditing}
                            defaultValue={chapter?.text.content}
                            value={newTextContent}
                            multiline
                            fullWidth
                            variant="outlined"
                            onChange={(e) => setContent(e.target.value)}
                            sx={{mt: 5}}
                            maxRows="20"/>
                        : <Typography gutterBottom align='left' sx={{mt: 4}}>
                            {chapter?.text.content}
                        </Typography>
                    }

                </Box>
                <Box sx={{display: 'flex', justifyContent: 'flex-end', mt: 2}}>
                    <Button
                        variant="outlined"
                        sx={{width: '15%', display: isEditing ? 'none' : 'block', mr: 2}}
                        onClick={() => navigate("/chapters")}
                    >
                        Back to chapters
                    </Button>
                    <Button
                        variant="contained"
                        sx={{width: '15%', display: isEditing ? 'none' : 'block'}}
                        onClick={() => setIsEditing(!isEditing)}
                    >
                        Edit
                    </Button>
                    <Button
                        variant="outlined"
                        sx={{width: '15%', display: isEditing ? 'block' : 'none', mr: 2}}
                        onClick={() => setIsEditing(!isEditing)}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        sx={{width: '15%', display: isEditing ? 'block' : 'none'}}
                        onClick={() => {
                            updateChapter();
                            setIsEditing(!isEditing)
                        }}
                    >
                        Save</Button>
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


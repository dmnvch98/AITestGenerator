import {Alert, Box, Button, Container, Snackbar} from "@mui/material";
import React, {useEffect, useState} from "react";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import {useTextStore} from "../../store/textStore";
import {TextEditor} from "../../components/texts/TextEditor";
import {TextViewer} from "../../components/texts/TextViewer";
import {LoggedInUserPage} from "../../components/main/LoggedInUserPage";

export const TextPageContent = () => {
    const {id} = useParams();
    const [isEditing, setIsEditing] = useState(false);
    const {
        texts, setTitle,
        setContent, textUpdatedFlag,
        toggleTextUpdatedFlag, getUserTextsByIdIn,
        selectText, updateText,

    } = useTextStore();

    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        let isEditParamPresent = searchParams.get("edit");
        if (isEditParamPresent !== null && isEditParamPresent !== "false") {
            setIsEditing(true);
        } else {
            setIsEditing(false);
        }
    }, [location.search]);

    useEffect(() => {
        if (texts.length === 0) {
            getUserTextsByIdIn([Number(id)]).then(() => {
                loadTextData(Number(id));
            });
        } else {
            loadTextData(Number(id));
        }
    }, [id, texts]);

    const loadTextData = (id: number) => {
        const text = texts.find(ch => ch.id === id);
        if (text) {
            selectText(text);
            setTitle(text.title);
            setContent(text.content);
        }
    };

    return (
        <>
            <Container>
                <Box sx={{display: 'flex', flexDirection: 'column'}}>
                    {isEditing ? <TextEditor/> : <TextViewer/>}
                    <Box sx={{display: 'flex', mt: 2, marginLeft: "auto", width: '40%'}}>
                        <Button
                            variant="outlined"
                            sx={{flex: 1, marginRight: 2, display: isEditing ? 'none' : 'block'}}
                            onClick={() => navigate("/texts")}
                        >
                            Вернуться к текстам
                        </Button>
                        <Button
                            variant="contained"
                            sx={{flex: 1, display: isEditing ? 'none' : 'block'}}
                            onClick={() => setIsEditing(!isEditing)}
                        >
                            Редактировать
                        </Button>
                        <Button
                            variant="outlined"
                            sx={{flex: 1, marginRight: 2, display: isEditing ? 'block' : 'none'}}
                            onClick={() => setIsEditing(!isEditing)}
                        >
                            Отменить
                        </Button>
                        <Button
                            variant="contained"
                            sx={{flex: 1, display: isEditing ? 'block' : 'none'}}
                            onClick={() => {
                                updateText();
                                setIsEditing(!isEditing)
                            }}
                        >
                            Обновить
                        </Button>
                    </Box>
                </Box>

                <Snackbar
                    open={textUpdatedFlag}
                    autoHideDuration={3000}
                    onClose={toggleTextUpdatedFlag}
                >
                    <Alert severity="success">
                        Текст успешно обновлен
                    </Alert>
                </Snackbar>
            </Container>
        </>
    );
};
export const TextPage = () => {
    return <LoggedInUserPage mainContent={<TextPageContent/>}/>;
}

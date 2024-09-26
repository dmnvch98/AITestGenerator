import {LoggedInUserPage} from "../../components/main/LoggedInUserPage";
import React, {useEffect} from "react";
import {useTestStore} from "../../store/tests/testStore";
import {QuestionView} from "../../components/tests/questions/QuestionView";
import {useNavigate, useParams} from "react-router-dom";
import Typography from "@mui/material/Typography";
import {Box} from "@mui/material";
import Button from "@mui/material/Button";

const TestPageViewContent = () => {
    const {id} = useParams();
    const selectedTest = useTestStore(state => state.selectedTest);
    const getUserTestById = useTestStore(state => state.getUserTestById);
    const navigate = useNavigate();

    useEffect(() => {
        getUserTestById(Number(id));
    }, []);


    const handleEdit = () => {
        navigate(`/tests/${id}/edit`)
    }

    return (
        <>
            <Box display="flex" justifyContent="space-between" alignItems="center" sx={{mb: 2}}>
                <Typography variant='h4' align='left'>{selectedTest?.title}</Typography>
                <Button variant="outlined" color="primary" onClick={handleEdit}>Редактировать</Button>
            </Box>
            {selectedTest && selectedTest.questions.map((question, index) =>
                (<QuestionView key={index} question={question}/>))
            }
        </>
    )
}

export const TestPageView = () => {
    return <LoggedInUserPage mainContent={<TestPageViewContent/>}/>;

}
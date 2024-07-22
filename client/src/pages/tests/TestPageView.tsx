import {LoggedInUserPage} from "../../components/main/LoggedInUserPage";
import React, {useEffect} from "react";
import {useTestStore} from "../../store/tests/testStore";
import {QuestionView} from "../../components/tests/questions/QuestionView";
import {useNavigate, useParams} from "react-router-dom";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/material";
import Button from "@mui/material/Button";

const TestPageViewContent = () => {
    const {id} = useParams();
    const selectedTest = useTestStore(state => state.selectedTest);
    const getUserTestsByIdIn = useTestStore(state => state.getUserTestsByIdIn);
    const selectTest = useTestStore(state => state.selectTest);
    const tests = useTestStore(state => state.tests);
    const navigate = useNavigate();

    useEffect(() => {
        if (tests.length === 0) {
            getUserTestsByIdIn([Number(id)]).then(() => {
                loadTestData(Number(id));
            });
        } else {
            loadTestData(Number(id));
        }
    }, [id, tests]);

    const loadTestData = (id: number) => {
        const test = tests.find(test => test.id === id);
        if (test) {
            selectTest(test);
        }
    };

    const handleEdit = () => {
        navigate(`/tests/${id}/edit`)
    }


    return (
        <>
            <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
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
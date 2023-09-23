import {LoggedInUserPage} from "../../components/main/LoggedInUserPage";
import React, {useEffect} from "react";
import {useTestStore} from "../../store/tests/testStore";
import {QuestionView} from "../../components/tests/questions/QuestionView";
import {useParams} from "react-router-dom";
import Typography from "@mui/material/Typography";

const TestPageViewContent = () => {
    const {id} = useParams();
    const selectedTest = useTestStore(state => state.selectedTest);
    const getUserTestsByIdIn = useTestStore(state => state.getUserTestsByIdIn);
    const selectTest = useTestStore(state => state.selectTest);
    const tests = useTestStore(state => state.tests);

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


    return (
        <>
            <Typography variant='h4' align='left' sx={{mb: 2}}>{selectedTest?.title}</Typography>
            {selectedTest && selectedTest.questions.map((question, index) =>
                (<QuestionView key={index} question={question}/>))
            }
        </>
    )
}

export const TestPageView = () => {
    return <LoggedInUserPage mainContent={<TestPageViewContent/>}/>;

}
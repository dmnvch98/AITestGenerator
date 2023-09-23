import { useEffect, useState } from "react";
import { useTestStore } from "../../store/tests/testStore";
import {useNavigate, useParams} from "react-router-dom";
import {QAP} from "../../components/tests/QAP";
import {LoggedInUserPage} from "../../components/main/LoggedInUserPage";

const TestPassContent = () => {
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

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

    const handleNextQuestion = () => {
        if (selectedTest && (currentQuestionIndex < selectedTest.questions.length - 1)) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            navigate("/tests/result")
        }
    };

    return (
        <>
            {selectedTest && (
                <QAP
                    question={selectedTest.questions[currentQuestionIndex]}
                    questionNumber={currentQuestionIndex + 1}
                    onNextQuestion={handleNextQuestion}
                />
            )}
        </>
    );
};

export const TestPass = () => {
    return <LoggedInUserPage mainContent={<TestPassContent />}/>;
};

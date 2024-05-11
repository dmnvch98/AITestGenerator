import {useEffect, useState} from "react";
import {Question, useTestStore} from "../../store/tests/testStore";
import {useNavigate} from "react-router-dom";
import {QAP} from "../../components/tests/QAP";
import {LoggedInUserPage} from "../../components/main/LoggedInUserPage";
import {usePassTestStore} from "../../store/tests/passTestStore";

const TestPassContent = () => {
    const testIdsToPass = usePassTestStore(state => state.testIdsToPass);
    const testToPass = usePassTestStore(state => state.testToPass);
    const setTestsToPass = usePassTestStore(state => state.setTestsToPass);
    const saveTestResult = usePassTestStore(state => state.saveTestResult);
    const getUserTestsByIdIn = useTestStore(state => state.getUserTestsByIdIn);
    const tests = useTestStore(state => state.tests);
    const navigate = useNavigate();

    useEffect(() => {
        if (tests.length === 0) {
            getUserTestsByIdIn(testIdsToPass).then(() => {
                setTestsToPass(tests)
            });
        } else {
            setTestsToPass(tests.filter(t => testIdsToPass.includes(t.id)));
        }
    }, [tests]);

    const [currentTestId, setCurrentTestId] = useState(0);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

    const handleNextQuestion = () => {
        const currentTest = testToPass[currentTestId];

        // Check if there are more questions in the current test
        if (currentTest && currentQuestionIndex < currentTest.questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            saveTestResult(currentTest.title, currentTest.id);
            // If there are no more questions in the current test
            if (currentTestId < testToPass.length - 1) {
                // Move to the next test
                setCurrentTestId(currentTestId + 1);
                // Reset the question index to the first question of the next test
                setCurrentQuestionIndex(0);
            } else {
                // If there are no more tests, navigate to the results page
                navigate("/tests/result");
            }
        }
    };

    const getCurrentQuestion = (): Question => {
        const question: Question = testToPass[currentTestId].questions[currentQuestionIndex];
        question.answerOptions.sort(() => Math.random() - 0.5);
        return question;
    }


    return (
        <>
            {testToPass.length > 0 && (
                <QAP
                    question={getCurrentQuestion()}
                    questionNumber={currentQuestionIndex + 1}
                    allQuestionsNumber={testToPass[currentTestId].questions.length}
                    onNextQuestion={handleNextQuestion}
                    testTitle={testToPass[currentTestId].title}
                    currentTestNumber={currentTestId + 1}
                    allTestsNumber={testToPass.length}
                />
            )}
        </>
    );
};

export const TestPass = () => {
    return <LoggedInUserPage mainContent={<TestPassContent/>}/>;
};

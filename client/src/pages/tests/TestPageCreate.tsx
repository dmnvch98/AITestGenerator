import React from "react";
import { useNavigate } from "react-router-dom";
import {useTestStore, CreateTestRequestDto} from "../../store/tests/testStore";
import { LoggedInUserPage } from "../../components/main/LoggedInUserPage";
import {TestForm} from "../../components/tests/TestForm";

export const TestPageCreate = () => {
    const { saveTest } = useTestStore();
    useNavigate();
    const handleSave = (newTest: CreateTestRequestDto) => {
        saveTest(newTest);
    };

    const initialTest: CreateTestRequestDto = {
        title: "",
        questions: [
            {
                id: Date.now(),
                questionText: "",
                answerOptions: [
                    {
                        id: Date.now() + 1,
                        optionText: "",
                        isCorrect: false
                    }
                ]
            }
        ]
    };

    return (
        <LoggedInUserPage
            mainContent={
                <TestForm
                    initialTest={initialTest}
                    onSave={handleSave}
                    isEditMode={false}
                />
            }
        />
    );
};

import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {UserTest, useTestStore} from "../../store/tests/testStore";
import { LoggedInUserPage } from "../../components/main/LoggedInUserPage";
import {TestForm} from "../../components/tests/TestForm";
import {useUserStore} from "../../store/userStore";

export const TestPageEdit = () => {
    const { id } = useParams();
    const { setLoading } = useUserStore();
    const { selectedTest, getUserTestById, updateTest, clearSelectedTest } = useTestStore();
    useNavigate();
    useEffect(() => {
        setLoading(true);
        getUserTestById(Number(id));
        setLoading(false);
        return () => clearSelectedTest();
    }, [id, getUserTestById, clearSelectedTest]);

    const handleSave = (updatedTest: UserTest) => {
        updateTest(updatedTest);
    };

    return (
        <LoggedInUserPage
            mainContent={
                <TestForm
                    initialTest={selectedTest}
                    onSave={handleSave}
                    isEditMode={true}
                />
            }
        />
    );
};

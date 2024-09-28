import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {useTestStore} from "../../store/tests/testStore";
import { LoggedInUserPage } from "../../components/main/LoggedInUserPage";
import {TestForm} from "../../components/tests/TestForm";
import {useUserStore} from "../../store/userStore";

export const TestPageEdit = () => {
    const { id } = useParams();
    const { setLoading } = useUserStore();
    const { selectedTest, getUserTestById, upsert, clearSelectedTest } = useTestStore();
    useNavigate();
    useEffect(() => {
        setLoading(true);
        getUserTestById(Number(id));
        setLoading(false);
        return () => clearSelectedTest();
    }, [id, getUserTestById, clearSelectedTest]);

    return (
        <LoggedInUserPage
            mainContent={
                <TestForm
                    initialTest={selectedTest}
                    isEditMode={true}
                />
            }
        />
    );
};

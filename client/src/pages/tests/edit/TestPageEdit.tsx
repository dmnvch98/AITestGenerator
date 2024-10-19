import React, { useEffect, useState } from "react";
import {useNavigate, useParams} from "react-router-dom";
import { useTestStore } from "../../../store/tests/testStore";
import { LoggedInUserPage } from "../../../components/main/LoggedInUserPage";
import { TestForm } from "../components/TestForm";

export const TestPageEdit = () => {
    const { id } = useParams();
    const { selectedTest, getUserTestById, clearSelectedTest, setAlert } = useTestStore();
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    const loadData = async () => {
        setIsLoading(true);
        await getUserTestById(Number(id)).then(test => {
            if (!test) {
                navigate('/tests');
                setAlert([{ id: Date.now(), message: 'Тест не найден', severity: 'error' }]);
            }
        });
        setTimeout(() => {
            setIsLoading(false);
        }, 200);
    };

    useEffect(() => {
        loadData();
        return () => clearSelectedTest();
    }, [id, getUserTestById, clearSelectedTest]);

    return (
        <LoggedInUserPage
            mainContent={
                    <TestForm
                        initialTest={selectedTest}
                        isEditMode={true}
                        isLoading={isLoading}
                    />
            }
        />
    );
};

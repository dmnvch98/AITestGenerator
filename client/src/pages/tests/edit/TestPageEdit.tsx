import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {useTestStore} from "../../../store/tests/testStore";
import {TestForm} from "../components/TestForm";
import {AlertMessage} from "../../../store/types";

export const TestPageEdit = () => {
    const {id} = useParams();
    const {selectedTest, getUserTestById, clearSelectedTest, addAlert, clearState} = useTestStore();
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    const loadData = async () => {
        setIsLoading(true);
        await getUserTestById(Number(id)).then(test => {
            if (!test) {
                navigate('/tests');
                addAlert(new AlertMessage('Тест не найден', 'error'))
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

    useEffect(() => {
        return () => {
            clearState();
        }
    }, [])

    return (
        <TestForm
            initialTest={selectedTest}
            isEditMode={true}
            isLoading={isLoading}
        />

    );
};

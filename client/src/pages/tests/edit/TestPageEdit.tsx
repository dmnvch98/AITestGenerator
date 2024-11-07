import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {UserTest, useTestStore} from "../../../store/tests/testStore";
import {TestForm} from "../components/TestForm";
import {AlertMessage} from "../../../store/types";
import {createNewTest} from "./utils";

export const TestPageEdit = () => {
    const {id} = useParams();
    const {getUserTestById, addAlert, clearState} = useTestStore();
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const [testToEdit, setTestToEdit] = useState<UserTest>();

    const loadData = async () => {
        setIsLoading(true);
        await getUserTestById(Number(id)).then(test => {
            if (!test) {
                navigate('/tests');
                addAlert(new AlertMessage('Тест не найден', 'error'))
            }
            setTestToEdit(test);
        });
        setTimeout(() => {
            setIsLoading(false);
        }, 200);
    };

    useEffect(() => {
        loadData();
    }, [id, getUserTestById]);

    useEffect(() => {
        return () => {
            clearState();
        }
    }, [])

    return (
        <TestForm
            initialTest={testToEdit || createNewTest()}
            isLoading={isLoading}
        />

    );
};

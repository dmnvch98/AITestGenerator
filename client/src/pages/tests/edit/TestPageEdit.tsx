import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {UserTest, useTestStore} from "../../../store/tests/testStore";
import {TestForm} from "../components/TestForm";
import {AlertMessage} from "../../../store/types";
import {createNewTest} from "./utils";
import NotificationService from "../../../services/notification/AlertService";

export const TestPageEdit = () => {
    const {id} = useParams();
    const {getUserTestById, clearState} = useTestStore();
    const navigate = useNavigate();
    const [testToEdit, setTestToEdit] = useState<UserTest>();

    const loadData = async () => {
        await getUserTestById(Number(id)).then(test => {
            if (!test) {
                navigate('/tests');
                NotificationService.addAlert(new AlertMessage('Тест не найден', 'error'))
            }
            setTestToEdit(test);
        });
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
        />

    );
};

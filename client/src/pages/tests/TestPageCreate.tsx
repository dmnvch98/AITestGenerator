import React from "react";
import { useNavigate } from "react-router-dom";
import {useTestStore, CreateTestRequestDto} from "../../store/tests/testStore";
import { LoggedInUserPage } from "../../components/main/LoggedInUserPage";
import {TestForm} from "../../components/tests/TestForm";

export const TestPageCreate = () => {

    useNavigate();

    return (
        <LoggedInUserPage
            mainContent={
                <TestForm
                    isEditMode={false}
                />
            }
        />
    );
};

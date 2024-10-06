import React from "react";
import { useNavigate } from "react-router-dom";
import { LoggedInUserPage } from "../../../components/main/LoggedInUserPage";
import {TestForm} from "../components/TestForm";

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

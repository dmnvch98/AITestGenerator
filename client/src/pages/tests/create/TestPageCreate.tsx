import React from "react";
import {TestForm} from "../components/TestForm";
import {createNewTest} from "../edit/utils";

export const TestPageCreate = () => {
    return (
        <TestForm
            initialTest={createNewTest()}
        />
    );
};

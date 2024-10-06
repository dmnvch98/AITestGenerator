import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useTestStore } from "../../../store/tests/testStore";
import { LoggedInUserPage } from "../../../components/main/LoggedInUserPage";
import { TestForm } from "../components/TestForm";
import { CircularProgress, Box } from "@mui/material";

export const TestPageEdit = () => {
    const { id } = useParams();
    const { selectedTest, getUserTestById, clearSelectedTest } = useTestStore();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            await getUserTestById(Number(id));
            setIsLoading(false);
        };

        loadData();

        return () => clearSelectedTest();
    }, [id, getUserTestById, clearSelectedTest]);

    return (
        <LoggedInUserPage
            mainContent={
                isLoading ? (
                    <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                        <CircularProgress />
                    </Box>
                ) : (
                    <TestForm
                        initialTest={selectedTest}
                        isEditMode={true}
                    />
                )
            }
        />
    );
};

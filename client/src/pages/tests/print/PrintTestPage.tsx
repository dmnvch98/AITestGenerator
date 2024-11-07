import React, {useEffect, useRef} from 'react';
import {Box} from '@mui/material';
import {PrintTestSettings} from "./PrintTestSettings";
import {PrintTestContent} from "./PrintTestContent";
import {ContentActionsPage} from "../../../components/main/data-display/ContentActionsPage";
import {useLocation, useNavigate} from "react-router-dom";
import {useTestStore} from "../../../store/tests/testStore";

export const PrintTestPage = () => {
    const componentRef = useRef<HTMLDivElement>(null);
    const location = useLocation();
    const navigate = useNavigate();

    const { printTest, selectedTest } = useTestStore();

    useEffect(() => {
        if (selectedTest) {
            document.title = selectedTest.title;
        }
    }, [selectedTest]);

    const handleReturnToPrevPage = () => {
        const prevUrl = location?.state?.previousLocationPathname || '/tests';
        navigate(prevUrl);
    }

    const Content = (
        <Box ref={componentRef} flexGrow={1}>
            <PrintTestContent/>
        </Box>
    );

    const Actions = (
        <Box>
            <PrintTestSettings printRef={componentRef} handleReturn={handleReturnToPrevPage} handlePrint={printTest}/>
        </Box>
    )
    return (
        <>
            <ContentActionsPage content={Content} actions={Actions}/>
        </>
    )
};

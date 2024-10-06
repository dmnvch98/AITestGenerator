import React, { useRef } from 'react';
import {Box} from '@mui/material';
import {LoggedInUserPage} from "../../../components/main/LoggedInUserPage";
import {PrintTestSettings} from "./PrintTestSettings";
import {PrintTestContent} from "./PrintTestContent";

const PrintTestPageContent: React.FC = () => {
    const componentRef = useRef<HTMLDivElement>(null);

    return (
        <Box display="flex" flexDirection="column" width="91%">
            <Box display="flex" flexWrap="wrap">
                <Box ref={componentRef} flexGrow={1}>
                    <PrintTestContent/>
                </Box>
                <Box>
                    <PrintTestSettings printRef={componentRef} />
                </Box>
            </Box>
        </Box>
    );
};

export const PrintTestPage = () => {
    return (
        <>
        <LoggedInUserPage mainContent={<PrintTestPageContent/>}/>
        </>
    )
};

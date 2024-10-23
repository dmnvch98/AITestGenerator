import React, { useRef } from 'react';
import {Box} from '@mui/material';
import {PrintTestSettings} from "./PrintTestSettings";
import {PrintTestContent} from "./PrintTestContent";
import {ContentActionsPage} from "../../../components/main/data-display/ContentActionsPage";

export const PrintTestPage = () => {
    const componentRef = useRef<HTMLDivElement>(null);

    const Content = (
        <Box ref={componentRef} flexGrow={1}>
            <PrintTestContent/>
        </Box>
    );

    const Actions = (
        <Box>
            <PrintTestSettings printRef={componentRef} />
        </Box>
    )
    return (
        <>
            <ContentActionsPage content={Content} actions={Actions}/>
        </>
    )
};

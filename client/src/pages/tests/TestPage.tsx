import {TabItem, TabsPanel} from "../../components/main/tabsPanel/TabsPanel";
import React from "react";
import Box from "@mui/material/Box";
import {Tests} from "./Tests";
import {LoggedInUserPage} from "../../components/main/LoggedInUserPage";
import {TestGenerationHistory} from "../history/TestGenerationHistory";
import {UserTestResults} from "./UserTestResults";

export const TestPageContent = () => {
    const tabs: TabItem[] = [
        { index: 0, value: 0, children: <Box><Tests/></Box>, title: 'Тесты' },
        { index: 1, value: 1, children: <Box><TestGenerationHistory/></Box>, title: 'История генераций' },
        { index: 1, value: 1, children: <Box><UserTestResults/></Box>, title: 'История прохождений' },
    ];

    return (
        <>
        <TabsPanel tabs={tabs}/>
        </>
    )
}

export const TestsPage = () => {
    return <LoggedInUserPage mainContent={<TestPageContent/>}/>;
}
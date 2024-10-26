import {TabItem, TabsPanel} from "../../components/main/tabsPanel/TabsPanel";
import React, {useEffect, useState} from "react";
import Box from "@mui/material/Box";
import {Tests} from "./Tests";
import {LoggedInUserPage} from "../../components/main/LoggedInUserPage";
import {TestGenerationHistory} from "../history/TestGenerationHistory";
import {useLocation} from "react-router-dom";

export const TestPageContent = () => {
    const location = useLocation();
    const [activeTab, setActiveTab] = useState(0);
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const activeTabParam = searchParams.get('activeTab');

        if (activeTabParam) {
            switch (activeTabParam) {
                case 'tests':
                    setActiveTab(0);
                    break;
                case 'history':
                    setActiveTab(1);
                    break;
                case 'results':
                    setActiveTab(2);
                    break;
                default:
                    setActiveTab(0);
                    break;
            }
        }
    }, [location]);
    const tabs: TabItem[] = [
        { index: 0, value: 0, children: <Box><Tests/></Box>, title: 'Тесты' },
        { index: 1, value: 1, children: <Box><TestGenerationHistory/></Box>, title: 'История генераций' },
    ];

    return (
        <>
            <TabsPanel tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
        </>
    )
}

export const TestsPage = () => {
    return <LoggedInUserPage mainContent={<TestPageContent/>}/>;
}
import React, {useEffect, useState} from "react";
import Box from "@mui/material/Box";
import {TabItem, TabsPanel} from "../../components/main/tabsPanel/TabsPanel";
import {useLocation} from "react-router-dom";
import {TestGenHistoryPast} from "./components/TestGenHistoryPast";
import {TestGenHistoryCurrent} from "./components/TestGenHistoryCurrent";

export const TestGenerationHistory = () => {
    const location = useLocation();
    const [activeTab, setActiveTab] = useState(0);

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const currentHistoryParam = searchParams.get('currentHistory');
        if (currentHistoryParam) {
            setActiveTab(currentHistoryParam === 'true' ? 0 : 1);
        }
    }, [location]);

    const tabs: TabItem[] = [
        {index: 0, value: 0, children: <Box><TestGenHistoryCurrent/></Box>, title: 'Текущие'},
        {index: 1, value: 1, children: <Box><TestGenHistoryPast/></Box>, title: 'Прошедшие'},
    ];

    return (
        <TabsPanel tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab}/>
    );
};

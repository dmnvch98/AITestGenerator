import { TestGenHistoryTable } from "../../components/history/TestGenHistoryTable";
import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { useUserStore } from "../../store/userStore";
import { TabItem, TabsPanel } from "../../components/main/tabsPanel/TabsPanel";
import { useLocation } from "react-router-dom";
import Typography from "@mui/material/Typography";
import { Alert } from "@mui/material";

const TestGenHistoryPast = () => {
    const { getTestGenHistory, testGenHistoryPast } = useUserStore();

    useEffect(() => {
        getTestGenHistory();
    }, [getTestGenHistory]);

    return (
        <>
            <Box display="flex" sx={{ mb: 2 }} justifyContent="flex-end">
            </Box>
            <TestGenHistoryTable testGenHistory={testGenHistoryPast} />
        </>
    );
};

const TestGenHistoryCurrent = () => {
    const {
        currentActivities,
        initState,
        deleteFinishedUserActivitiesFromServer
    } = useUserStore();

    useEffect(() => {
        initState();
    }, [])

    useEffect(() => {
        return () => {
            deleteFinishedUserActivitiesFromServer();
        };
    }, []);

    return (
        <>
            <Alert severity="info" icon={false}>
                <Typography fontSize={14} align="left">
                    Здесь отображаются ваши активные задачи по генерации тестов. Процесс может занять от 10 секунд до 10 минут, в зависимости от размера текста и состояния стороннего ИИ.
                    <br />
                    Обратите внимание: генерация происходит в фоновом режиме, и вы можете закрыть эту страницу.
                </Typography>
            </Alert>

            <TestGenHistoryTable testGenHistory={currentActivities} />
        </>
    );
};

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
        { index: 0, value: 0, children: <Box><TestGenHistoryCurrent /></Box>, title: 'Текущие' },
        { index: 1, value: 1, children: <Box><TestGenHistoryPast /></Box>, title: 'Прошедшие' },
    ];

    return (
        <TabsPanel tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
    );
};

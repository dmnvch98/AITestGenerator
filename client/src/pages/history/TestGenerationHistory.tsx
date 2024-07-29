import {TestGenHistoryTable} from "../../components/history/TestGenHistoryTable";
import React, {useEffect} from "react";
import Box from "@mui/material/Box";
import {TestGenHistory, useUserStore} from "../../store/userStore";
import {TabItem, TabsPanel} from "../../components/main/tabsPanel/TabsPanel";
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const TestGenHistoryPast = () => {
    const {getTestGenHistory, testGenHistoryPast} = useUserStore();

    useEffect(() => {
        getTestGenHistory();
    }, [])

    return(
        <>
            <Box display="flex" sx={{ mb: 2 }} justifyContent="flex-end">
            </Box>
            <TestGenHistoryTable testGenHistory={testGenHistoryPast}/>
        </>
    )
}

const TestGenHistoryCurrent = () => {
    const { getCurrentUser, user } = useUserStore();

    const {getTestGenHistoryCurrent, testGenHistoryCurrent, setCurrentTestGenHistories} = useUserStore();
    useEffect(() => {
        getTestGenHistoryCurrent();
        getCurrentUser();
    }, [])

    useEffect(() => {
        const socket = new SockJS('http://localhost:8080/ws');
        const client = new Client({
            webSocketFactory: () => socket,
            onConnect: () => {
                client.subscribe(`/user/${user?.id}/queue/TestGeneratingHistory`, message => {
                    const updatedHistory = JSON.parse(message.body) as TestGenHistory;
                    setCurrentTestGenHistories(updatedHistory);
                });
                console.log('Subscribed: ' + `/user/${user?.id}/queue/TestGeneratingHistory`);
            },
            onStompError: (frame) => {
                console.error('Broker reported error: ' + frame.headers['message']);
                console.error('Additional details: ' + frame.body);
            },
        });

        client.activate();

        return () => {
            client.deactivate();
        };
    }, [user]);


    return(
        <>
            <Box display="flex" sx={{ mb: 2 }} justifyContent="flex-end">
            </Box>
            <TestGenHistoryTable testGenHistory={testGenHistoryCurrent}/>
        </>
    )
}

export const TestGenerationHistory = () => {
    const tabs: TabItem[] = [
        { index: 0, value: 0, children: <Box><TestGenHistoryCurrent/></Box>, title: 'Текущие' },
        { index: 1, value: 1, children: <Box><TestGenHistoryPast/></Box>, title: 'Прошедшие' },
    ];

    return (
        <>
            <TabsPanel tabs={tabs}/>
        </>
    )
}
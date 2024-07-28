import {TestGenHistoryTable} from "../../components/history/TestGenHistoryTable";
import React, {useEffect, useState} from "react";
import Box from "@mui/material/Box";
import {TestGenHistory, useUserStore} from "../../store/userStore";
import {TabItem, TabsPanel} from "../../components/main/tabsPanel/TabsPanel";
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const TestGenHistoryPast = () => {
    const {getTestGenHistory, testGenHistory} = useUserStore();

    useEffect(() => {
        getTestGenHistory();
    }, [])

    return(
        <>
            <Box display="flex" sx={{ mb: 2 }} justifyContent="flex-end">
            </Box>
            <TestGenHistoryTable testGenHistory={testGenHistory}/>
        </>
    )
}

const TestGenHistoryCurrent = () => {
    const [history, setHistories] = useState<TestGenHistory[]>([]);
    const userId = 1;

    const {getTestGenHistory} = useUserStore();

    useEffect(() => {
        getTestGenHistory();
    }, [])

    const replaceObjectInArray = (array: TestGenHistory[], updatedObject: TestGenHistory): TestGenHistory[] => {
        const index = array.findIndex(obj => obj.id === updatedObject.id);
        if (index !== -1) {
            return [...array.slice(0, index), updatedObject, ...array.slice(index + 1)];
        } else {
            return [...array, updatedObject];
        }
    };

    useEffect(() => {
        const socket = new SockJS('http://localhost:8080/ws');
        const client = new Client({
            webSocketFactory: () => socket,
            onConnect: () => {
                client.subscribe(`/user/${userId}/queue/TestGeneratingHistory`, message => {
                    const updatedHistory = JSON.parse(message.body) as TestGenHistory;
                    setHistories(prevHistories => replaceObjectInArray(prevHistories, updatedHistory));
                });
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
    }, [userId]);


    return(
        <>
            <Box display="flex" sx={{ mb: 2 }} justifyContent="flex-end">
            </Box>
            <TestGenHistoryTable testGenHistory={history}/>
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
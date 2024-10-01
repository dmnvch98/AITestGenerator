import {useEffect, useState} from 'react';
import SockJS from 'sockjs-client';
import {Client} from '@stomp/stompjs';
import {TestGenHistory} from "./userStore";

export const useTestGenHistoryWebSocket = (userId: number | undefined) => {
    const [testGenHistory, setTestGenHistory] = useState<TestGenHistory>();

    useEffect(() => {
        if (!userId) return;

        const socket = new SockJS('http://localhost:8080/ws');
        const client = new Client({
            webSocketFactory: () => socket,
            onConnect: () => {
                client.subscribe(`/user/${userId}/queue/TestGeneratingHistory`, message => {
                    const history = JSON.parse(message.body) as TestGenHistory;
                    setTestGenHistory(history);
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

    return testGenHistory;
};

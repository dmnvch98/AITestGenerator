// src/services/sse/SseService.ts
import getAxiosInstance from "../../interceptors/getAxiosInstance";
import { NotificationType } from "../../store/tests/types";
import { useUserStore } from "../../store/userStore";

type HandshakeResponse = {
    sessionId: string;
    subscriptionId: string;
};

class SseService {
    private static instance: SseService;
    private axiosInstance;
    private eventSource: EventSource | null = null;
    private reconnectInterval: number = 1000; // Начальный интервал переподключения
    private maxReconnectInterval: number = 30000; // Максимальный интервал переподключения

    private constructor() {
        this.axiosInstance = getAxiosInstance();
    }

    public static getInstance(): SseService {
        if (!SseService.instance) {
            SseService.instance = new SseService();
        }
        return SseService.instance;
    }

    public async initializeSse(): Promise<void> {
        try {
            if (this.eventSource) {
                console.error("SSE already stebleshed");
                return;
            }
            const handshakeData = await this.sseHandshake();
            if (handshakeData) {
                const { subscriptionId } = handshakeData;
                this.connect(subscriptionId);
            }
        } catch (error) {
            console.error("Failed to initialize SSE", error);
            this.scheduleReconnect();
        }
    }

    private async sseHandshake(): Promise<HandshakeResponse | null> {
        try {
            const { data } = await this.axiosInstance.post<HandshakeResponse>('/api/v1/sse', {});
            return { sessionId: data.sessionId, subscriptionId: data.subscriptionId };
        } catch (ex) {
            console.error("An error occurred during SSE handshake", ex);
            return null;
        }
    }

    private connect(subscriptionId: string): void {
        const backendUrl = process.env.REACT_APP_SERVER_URL || "http://localhost:8080";
        this.eventSource = new EventSource(`${backendUrl}/api/v1/sse/subscribe?subId=${subscriptionId}`);

        this.eventSource.addEventListener('open', () => {
            this.reconnectInterval = 1000;
        });

        this.eventSource.addEventListener('message', (event) => {
            const parsedMessage = JSON.parse(event.data);
            if (parsedMessage.type === NotificationType.ACTIVITY) {
                this.handleActivityNotification();
            }
        });

        this.eventSource.addEventListener('error', (event) => {
            this.closeConnection();
            this.scheduleReconnect();
        });
    }

    private scheduleReconnect(): void {
        setTimeout(() => {
            this.initializeSse();
            this.reconnectInterval = Math.min(this.reconnectInterval * 2, this.maxReconnectInterval);
        }, this.reconnectInterval);
    }

    public closeConnection(): void {
        if (this.eventSource) {
            this.eventSource.close();
            this.eventSource = null;
        }
    }

    private async handleActivityNotification(): Promise<void> {
        try {
            useUserStore.getState().getTestGenCurrentActivities();
        } catch (ex) {
            console.error("Failed to handle activity notification", ex);
        }
    }
}

export default SseService.getInstance();

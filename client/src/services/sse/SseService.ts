import getAxiosInstance from "../../interceptors/getAxiosInstance";
import {NotificationType} from "../../store/tests/types";
import {useUserStore} from "../../store/userStore";

type HandshakeResponse = {
    sessionId: string;
    subscriptionId: string;
};

class SseService {

    private readonly axiosInstance;

    constructor() {
        this.axiosInstance = getAxiosInstance();
    }

    public async sseHandshake(): Promise<{ sessionId: string; subscriptionId: string } | null> {
        try {
            const { data } = await this.axiosInstance.post<HandshakeResponse>('/api/v1/sse', {});
            return { sessionId: data.sessionId, subscriptionId: data.subscriptionId };
        } catch (ex) {
            console.error("An error occurred during SSE handshake", ex);
            return null;
        }
    }

    public subscribe(subId: string): EventSource {
        const backendUrl = process.env.REACT_APP_SERVER_URL || "http://localhost:8080";
        const eventSource = new EventSource(`${backendUrl}/api/v1/sse/subscribe?subId=${subId}`);

        eventSource.addEventListener('open', () => {
            console.log("SSE connection established");
        });

        eventSource.addEventListener('message', (event) => {
            const parsedMessage = JSON.parse(event.data);

            if (parsedMessage === NotificationType.ACTIVITY) {
                this.handleActivityNotification();
            }
        });

        eventSource.addEventListener('error', () => {
            eventSource.close();
        });

        return eventSource;
    }

    public closeConnection(eventSource: EventSource): void {
        if (eventSource) {
            eventSource.close();
            console.log("SSE connection closed");
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

export default SseService;

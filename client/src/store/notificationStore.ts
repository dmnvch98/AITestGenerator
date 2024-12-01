import { create } from 'zustand';
import { AlertMessage } from "./types";

export interface Snackbar {
    id: string;
    message: string;
    variant: "info" | "default" | "error" | "success" | "warning" | undefined;
}

export interface NotificationStore {
    alerts: AlertMessage[];
    addAlert: (alert: AlertMessage) => void;
    addAlerts: (alerts: AlertMessage[]) => void;
    clearAlerts: () => void;
    deleteAlert: (alert: AlertMessage) => void;
}

export const useNotificationStore = create<NotificationStore>((set) => ({
    alerts: [],
    addAlert: (alert: AlertMessage) => set((state) => ({
        alerts: [...state.alerts, alert]
    })),
    addAlerts: (alerts: AlertMessage[]) => set((state) => ({
        alerts: [...state.alerts, ...alerts]
    })),
    clearAlerts: () => set({ alerts: [] }),
    deleteAlert: (alertToDelete) => set((state) => ({
        alerts: state.alerts.filter(alert => alert.id !== alertToDelete.id),
    })),
}));

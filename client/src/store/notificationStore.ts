import { create } from 'zustand';

export interface Snackbar {
    id: string;
    message: string;
    variant: "info" | "default" | "error" | "success" | "warning" | undefined;
}

export interface NotificationStore {
    snackbars: Snackbar[];
    addNotification: (message: string, variant: string) => void;
    removeNotification: (snackbar: Snackbar) => void;
}

export const useNotificationStore = create<NotificationStore>((set: any, get: any) => ({
    snackbars: [],
    addNotification: (message: string, variant: string) => {
        const id = new Date().getTime().toString();
        const snackbar = {id, message, variant};
        set({snackbars: [...get().snackbars, snackbar]});
    },
    removeNotification: (snackbar: Snackbar) => {
        set({
            snackbars: get().snackbars.filter((item: Snackbar) => item.id !== snackbar.id),
        });
    },
}));

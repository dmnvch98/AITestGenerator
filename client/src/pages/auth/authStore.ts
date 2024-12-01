import AuthService from "../../services/AuthService";
import {create} from "zustand";
import { AlertMessage } from '../../store/types';
import NotificationService from "../../services/notification/NotificationService";

interface AuthStore {
    authenticated: boolean;
    setAuthenticated: (status: boolean) => void;
    signup: (email: string, password: string) => Promise<Record<string, any> | null>;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => Promise<void>;
    refresh: () => Promise<void>;
    alerts: AlertMessage[];
    deleteAlert: (alert: AlertMessage) => void;
    clearAlerts: () => void;
}

const useAuthStore = create<AuthStore>((set, get) => ({
    authenticated: localStorage.getItem('JWT') !== null,
    alerts: [],

    setAuthenticated: (status) => {
        set({authenticated: status});
    },

    signup: async (email: string, password: string): Promise<Record<string, any> | null> => {
        try {
            return await AuthService.signup(email, password);
        } catch (error) {
            console.error('Ошибка при регистрации:', error);
            return null;
        }
    },

    login: async (email: string, password: string)=> {
        const { success, message, jwt} = await AuthService.login(email, password);
        if (success && jwt) {
            localStorage.setItem("JWT", jwt);
            set({authenticated: true});
            return true;
        } else if (message) {
            NotificationService.addAlert(new AlertMessage(message, 'error'));
        }
        return false;
    },

    logout: async () => {
        try {
            await AuthService.logout();
            localStorage.removeItem("JWT");
            set({authenticated: false});
            window.location.href = '/sign-in';
        } catch (error) {
            console.error('Ошибка при выходе:', error);
        }
    },

    refresh: async () => {
        try {
            const response = await AuthService.refresh();
            if (response && response.data) {
                localStorage.setItem("JWT", response.data.accessToken);
                set({authenticated: true});
            }
        } catch (error) {
            console.error('Ошибка при обновлении токена:', error);
        }
    },
    clearAlerts: () => set({alerts: []}),
    deleteAlert: (alertToDelete) => set((state) => ({
        alerts: state.alerts.filter(alert => alert.id !== alertToDelete.id)
    })),
}));

export default useAuthStore;

import AuthService from "../../services/AuthService";
import {create} from "zustand";
import { AlertMessage } from '../../store/types';

interface AuthStore {
    authenticated: boolean;
    loading: boolean;

    setAuthenticated: (status: boolean) => void;
    signup: (email: string, password: string) => Promise<Record<string, any> | null>;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    refresh: () => Promise<void>;
    alerts: AlertMessage[];
    clearAlerts: () => void;
    addAlert: (alert: AlertMessage) => void;
}

const useAuthStore = create<AuthStore>((set, get) => ({

    authenticated: localStorage.getItem('JWT') !== null,
    alerts: [],
    loading: false,

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
        set({loading: true});
        const { success, message, jwt} = await AuthService.login(email, password);

        if (success && jwt) {
            localStorage.setItem("JWT", jwt);
            set({authenticated: true});
            window.location.href = '/generate';
        } else if (message) {
            const { addAlert } = get();
            addAlert(new AlertMessage(message, 'error'));
        }
        set({loading: false});

    },

    logout: async () => {
        try {
            set({loading: true});
            await AuthService.logout();
            localStorage.removeItem("JWT");
            set({authenticated: false, loading: false});
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
    addAlert: (alert: AlertMessage) => set((state) => ({
        alerts: [...state.alerts, alert]
    })),
}));

export default useAuthStore;

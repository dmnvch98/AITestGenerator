import AuthService from "../../services/AuthService";
import {create} from "zustand";

interface AuthStore {
    authenticated: boolean;
    setAuthenticated: (status: boolean) => void;
    signup: (email: string, password: string) => Promise<Record<string, any> | null>;
    login: (email: string, password: string) => Promise<Record<string, any>>;
    logout: () => Promise<void>;
    refresh: () => Promise<void>;
}

const useAuthStore = create<AuthStore>((set, get) => ({
    authenticated: localStorage.getItem('JWT') !== null,

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

    login: async (email: string, password: string): Promise<Record<string, any>> => {
        const response = await AuthService.login(email, password);
        if (response && response.data) {
            localStorage.setItem("JWT", response.data.accessToken);
            set({authenticated: true});
        }
        return response;
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
}));

export default useAuthStore;
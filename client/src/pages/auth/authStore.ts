// userStore.ts
import create from 'zustand';
import AuthService from "../../services/AuthService";

interface AuthStore {
    isAuthenticated: boolean;
    setAuthenticated: (authStatus: boolean) => void;
    signup: (email: string, password: string) => Promise<Record<string, any> | null>;
    login: (email: string, password: string) => Promise<Record<string, any> | null>;
    logout: () => Promise<void>;
    refresh: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
    isAuthenticated: false,
    setAuthenticated: (authStatus) => set({ isAuthenticated: authStatus }),

    signup: async (email: string, password: string): Promise<Record<string, any> | null> => {
        try {
            return await AuthService.signup(email, password);
        } catch (error) {
            console.error('Ошибка при регистрации:', error);
            return null;
        }
    },

    login: async (email: string, password: string): Promise<Record<string, any> | null> => {
        try {
            const response = await AuthService.login(email, password);
            localStorage.setItem("JWT", response.data.accessToken);
            set({ isAuthenticated: true });
            return response;
        } catch (error) {
            console.error('Ошибка при входе:', error);
            return null;
        }
    },

    logout: async () => {
        try {
            localStorage.removeItem("JWT");
            set({ isAuthenticated: false });
            await AuthService.logout();
            window.location.href ='/sign-in';
        } catch (error) {
            console.error('Ошибка при выходе:', error);
        }
    },

    refresh: async () => {
        try {
            const response = await AuthService.refresh();
            localStorage.setItem("JWT", response.data.accessToken);
            set({ isAuthenticated: true });
        } catch (error) {
            console.error('Ошибка при выходе:', error);
            throw error;
        }
    }
}));

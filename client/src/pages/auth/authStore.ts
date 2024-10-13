// userStore.ts
import create from 'zustand';
import AuthService from "../../services/AuthService";
import UserService from "../../services/UserService";

interface AuthStore {
    authenticated: boolean;
    setAuthenticated: (status: boolean) => void;
    signup: (email: string, password: string) => Promise<Record<string, any> | null>;
    login: (email: string, password: string) => Promise<Record<string, any> | null>;
    logout: () => Promise<void>;
    refresh: () => Promise<void>;
    checkAuthentication: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
    authenticated: false,

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

    login: async (email: string, password: string): Promise<Record<string, any> | null> => {
        try {
            const response = await AuthService.login(email, password);
            if (response && response.data) {
                localStorage.setItem("JWT", response.data.accessToken);
                set({ authenticated: true });
            }
            return response;
        } catch (error) {
            console.error('Ошибка при входе:', error);
            return null;
        }
    },

    logout: async () => {
        try {
            await AuthService.logout();
            localStorage.removeItem("JWT");
            set({ authenticated: false });
            window.location.href = '/sign-in';
        } catch (error) {
            console.error('Ошибка при выходе:', error);
            // Optionally, handle specific logout errors here
        }
    },

    refresh: async () => {
        try {
            const response = await AuthService.refresh();
            if (response && response.data) {
                localStorage.setItem("JWT", response.data.accessToken);
                set({ authenticated: true });
            }
        } catch (error) {
            console.error('Ошибка при обновлении токена:', error);
        }
    },

    checkAuthentication: async () => {
        const response = await UserService.isAuthenticated();
        set({authenticated: Boolean(response)})
    }
}));

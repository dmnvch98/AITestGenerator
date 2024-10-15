// useAuth.ts

import useAuthStore from "./authStore";

export const useAuth = () => {
    const { logout, refresh } = useAuthStore();
    return { logout, refresh };
};

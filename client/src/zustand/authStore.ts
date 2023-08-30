import {create} from "zustand";

export interface AuthStore {
    "jwtToken": string,
    setJwtToken: (token: string) => void;
}

export const useAuthStore = create<AuthStore>((set: any) => ({
    jwtToken: "",
    setJwtToken: (token: string) => {
        console.log(token);
        set({jwtToken: token});
    }
}))
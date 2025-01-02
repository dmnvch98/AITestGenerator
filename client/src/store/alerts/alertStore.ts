import {create} from "zustand";
import IncidentService from "../../services/alerts/IncidentService";

export interface AlertStore {
    isIncidentExists: boolean;
    isLoading: boolean;
    getIsIncidentExists: () => void;
}

export const useIncidentStore = create<AlertStore>((set, get) => ({
    isIncidentExists: false,
    isLoading: false,
    getIsIncidentExists: async () => {
        set({ isLoading: true });
        const { exists } = await IncidentService.isIncidentExists();
        set({ isIncidentExists: exists, isLoading: false })
    }
}))

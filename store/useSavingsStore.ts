import { create } from "zustand";
import {
    AvailableSavingsPlan,
    getActiveSavings,
    getAvailableSavings,
} from "../services/savingsService";

interface SavingsState {
    availablePlans: AvailableSavingsPlan[];
    activePlans: AvailableSavingsPlan[];
    fetchAvailablePlans: () => Promise<void>;
    fetchActivePlans: () => Promise<void>;
    isLoading: boolean;
    isLoadingActive: boolean;
}

const useSavingsStore = create<SavingsState>((set) => ({
    availablePlans: [],
    isLoading: false,
    activePlans: [],
    isLoadingActive: false,

    fetchAvailablePlans: async () => {
        set({ isLoading: true });
        try {
            const response = await getAvailableSavings();
            if (response.success && response.data) {
                set({ availablePlans: response.data });
            } else {
                // In a real app, you might want to set an error state here
                console.error(response.message);
            }
        } catch (error) {
            console.error("Failed to fetch available savings plans:", error);
        } finally {
            set({ isLoading: false });
        }
    },

    fetchActivePlans: async () => {
        set({ isLoadingActive: true });
        try {
            const response = await getActiveSavings();
            if (response.success && response.data) {
                set({ activePlans: response.data });
            } else {
                console.error(response.message);
            }
        } catch (error) {
            console.error("Failed to fetch active savings plans:", error);
        } finally {
            set({ isLoadingActive: false });
        }
    },
}));

export default useSavingsStore;

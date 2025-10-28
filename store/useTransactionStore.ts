import { create } from "zustand";
import { TransactionCardProps } from "../components/TransactionCard";
import { getTransactions } from "../services/transactionService";

interface TransactionState {
    transactions: TransactionCardProps[];
    isLoading: boolean;
    error: string | null;
    fetchTransactions: () => Promise<void>;
}

const useTransactionStore = create<TransactionState>((set) => ({
    transactions: [],
    isLoading: false,
    error: null,
    fetchTransactions: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await getTransactions();
            if (response.success && response.data) {
                set({ transactions: response.data, isLoading: false });
            } else {
                throw new Error(
                    response.message || "Failed to fetch transactions"
                );
            }
        } catch (err: any) {
            set({ error: err.message, isLoading: false });
        }
    },
}));

export default useTransactionStore;

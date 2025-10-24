import { TransactionCardProps } from "../components/TransactionCard";

export const recentTransactions: TransactionCardProps[] = [
    {
        type: "debit",
        title: "Transfer to David (GTB)",
        date: "2025-10-12", // Today
        amount: "25,000",
        status: "Completed",
    },
    {
        type: "debit",
        title: "Netflix Subscription",
        date: "2025-10-11", // This Week
        amount: "5,500",
        status: "Completed",
    },
    {
        type: "credit",
        title: "Salary",
        date: "2025-09-28", // Last Month
        amount: "500,000",
        status: "Completed",
    },
];

export const allTransactions: TransactionCardProps[] = [
    ...recentTransactions,
    {
        type: "debit",
        title: "Airtime Purchase",
        date: "2025-10-08", // This Week
        amount: "2,000",
        status: "Completed",
    },
    {
        type: "credit",
        title: "Refund from Amazon",
        date: "2025-10-02", // This Month
        amount: "15,000",
        status: "Completed",
    },
    {
        type: "debit",
        title: "Spotify Premium",
        date: "2025-09-21", // Last Month
        amount: "1,500",
        status: "Failed",
    },
    {
        type: "credit",
        title: "From Jane Doe",
        date: "2025-08-15", // Older
        amount: "10,000",
        status: "Completed",
    },
];

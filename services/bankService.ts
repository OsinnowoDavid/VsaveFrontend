// --- Development Mock Data ---
const mockBankList = [
    { id: 1, code: "044", name: "Access Bank" },
    { id: 2, code: "023", name: "Citibank Nigeria" },
    { id: 3, code: "050", name: "Ecobank Nigeria" },
    { id: 4, code: "070", name: "Fidelity Bank" },
    { id: 5, code: "011", name: "First Bank of Nigeria" },
    { id: 6, code: "214", name: "First City Monument Bank" },
    { id: 7, code: "058", name: "Guaranty Trust Bank" },
    { id: 8, code: "033", name: "United Bank for Africa" },
    { id: 9, code: "035", name: "Wema Bank" },
    { id: 10, code: "057", name: "Zenith Bank" },
];
const mockResolvedAccounts: { [key: string]: { account_name: string } } = {
    "0123456789": { account_name: "JOHN DOE" },
    "9876543210": { account_name: "JANE SMITH" },
    "1234567890": { account_name: "ALICE WILLIAMS" },
};
// ---------------------------

export const getBankList = async (): Promise<{
    success: boolean;
    data?: { id: number; code: string; name: string }[];
    message?: string;
}> => {
    // --- Development Shortcut ---
    // This will return mock data instead of calling the API.
    console.log("Using mock bank list for development.");
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ success: true, data: mockBankList });
        }, 500); // Simulate a short network delay
    });
    // --------------------------
};

export const resolveBankAccount = async (details: {
    accountNumber: string;
    bankCode: string;
}): Promise<{
    success: boolean;
    data?: { account_name: string };
    message?: string;
}> => {
    // --- Development Shortcut ---
    console.log("Using mock account resolution for development.", details);
    return new Promise((resolve) => {
        setTimeout(() => {
            const resolvedAccount = mockResolvedAccounts[details.accountNumber];
            if (resolvedAccount) {
                resolve({ success: true, data: resolvedAccount });
            } else {
                resolve({
                    success: false,
                    message: "Invalid account number.",
                });
            }
        }, 1000); // Simulate a network delay
    });
    // --------------------------
};

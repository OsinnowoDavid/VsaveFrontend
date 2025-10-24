// --- Development Mock Data ---
const mockUsers = [
    { name: "Jane Doe", phone: "08098765432", tag: "@jane" },
    { name: "Peter Jones", phone: "08011223344", tag: "@peter" },
    { name: "Alice Williams", phone: "07012345678", tag: "@alice" },
];
// ---------------------------

export const resolveVsaveUser = async (
    phone: string
): Promise<{
    success: boolean;
    data?: { name: string; phone: string; tag: string };
    message?: string;
}> => {
    // This is a mock function. Replace with a real API call when available.
    // e.g., const response = await apiClient.get(`/user/resolve?phone=${phone}`);
    console.log("Resolving Vsave user with phone:", phone);

    return new Promise((resolve) => {
        setTimeout(() => {
            const user = mockUsers.find((u) => u.phone === phone);
            if (user) {
                resolve({ success: true, data: user });
            } else {
                resolve({ success: false, message: "Vsave user not found." });
            }
        }, 800); // Simulate network delay
    });
};

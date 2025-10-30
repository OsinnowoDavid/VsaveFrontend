import * as SecureStore from "expo-secure-store";

const PIN_KEY = "vs_transaction_pin";

/**
 * Creates and stores a new transaction PIN securely on the device.
 * @param pin The 4-digit transaction PIN.
 */
export const createPin = async (pin: string): Promise<void> => {
    try {
        // SecureStore encrypts the value on iOS and Android.
        await SecureStore.setItemAsync(PIN_KEY, pin);
    } catch (error) {
        console.error("Failed to save PIN securely", error);
        throw new Error("Could not set up your PIN. Please try again.");
    }
};

/**
 * Verifies the user's transaction PIN against the one stored on the device.
 * @param pin The 4-digit transaction PIN to verify.
 */
export const verifyPin = async (pin: string): Promise<void> => {
    try {
        const storedPin = await SecureStore.getItemAsync(PIN_KEY);

        if (storedPin === null) {
            throw new Error(
                "No transaction PIN has been set up on this device."
            );
        }

        if (storedPin !== pin) {
            throw new Error("Invalid PIN entered. Please try again.");
        }

        // If we reach here, the PIN is correct. The function resolves successfully.
    } catch (error: any) {
        // Re-throw the error to be caught by the UI component.
        throw error;
    }
};

/**
 * Checks if a PIN has been set on the device.
 * @returns A promise that resolves to true if a PIN exists, false otherwise.
 */
export const hasPin = async (): Promise<boolean> => {
    const storedPin = await SecureStore.getItemAsync(PIN_KEY);
    return storedPin !== null;
};

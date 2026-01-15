// In your types/data.ts
export interface SignUpData {
    fullName: string;      // Will be split into firstName/lastName
    email: string;
    phoneNumber: string;
    gender: string;
    dateOfBirth: Date ;     // This should be a Date object
    password: string;
    confirmPassword: string; // For UI only, not sent to API
    referralCode: string;    // Always sent (can be empty string)
}

export interface SignUpApiPayload {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phoneNumber: string;
    gender: string;
    dateOfBirth: string; // DD/MM/YYYY format
    referralCode?: string;
}

export interface Bank {
    id: string;
    name: string;
    code: string;
}

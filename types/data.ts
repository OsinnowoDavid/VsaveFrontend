export interface SignUpData {
    fullName: string;
    email: string;
    phoneNumber: string;
    gender: string;
    dateOfBirth: Date | string;
    password: string;
    confirmPassword: string;
    countryCode?: string;
}

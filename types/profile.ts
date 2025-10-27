import type { Document, Types } from "mongoose";

export interface IUser extends Document {
    _id: Types.ObjectId;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    password: string;
    profilePicture: string;
    vsavePoint: number;
    KYC: Types.ObjectId | null;
    availableBalance: number;
    pendingBalance: number;
    isEmailVerified: boolean;
    status: string;
    address: string;
    bvn?: string;
    gender: "Male" | "Female" | string;
    dateOfBirth: Date | string;
    virtualAccountNumber: string;
}

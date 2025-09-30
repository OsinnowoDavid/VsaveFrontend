import z from "zod";

interface Password {
    password: string;
    confirmPassword: string;
}

// Zod schema for validation
export const fullNameSchema = z
    .string()
    .trim()
    .min(3, { message: "Full name must be at least 3 characters." })
    .max(100, { message: "Full name cannot exceed 100 characters." })
    .refine(
        (value) => value.split(" ").length > 1,
        "Please enter your first and last name.",
    )
    .refine(
        (value) =>
            value.split(" ").length === 2 &&
            value.split(" ")[0].length >= 3 &&
            value.split(" ")[1].length >= 3,
        "First and last name must have at least 3 characters",
    )
    .refine(
        (value) => !/\s\s/.test(value), // Checks for two or more consecutive spaces
        "Full name cannot have multiple spaces between words.",
    )
    .refine(
        (value) => /^[a-zA-Z\s]+$/.test(value),
        "Full name can only contain letters and spaces.",
    );

export const emailSchema = z.email({ message: "Invalid email address." });

export const passwordSchema = z
    .string()
    .min(8, { message: "Password must be at least 8 characters long." })
    .max(100, { message: "Password cannot be longer than 100 characters." })
    .regex(/[a-z]/, {
        message: "Password must contain at least one lowercase letter.",
    })
    .regex(/[A-Z]/, {
        message: "Password must contain at least one uppercase letter.",
    })
    .regex(/[0-9]/, { message: "Password must contain at least one number." })
    .regex(/[^a-zA-Z0-9]/, {
        message: "Password must contain at least one special character.",
    });

export const confirmPasswordSchema = z
    .object({
        password: passwordSchema,
        confirmPassword: passwordSchema,
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match.",
        path: ["confirmPassword"],
    });

export const signupSchema = z.object({
    fullName: fullNameSchema,
    email: emailSchema,
    password: passwordSchema,
});

import { ToastAndroid } from "react-native";
import useAuthStore from "../store/useAuthStore";

interface HandleSignupProp {
    fullName: string;
    email: string;
    password: string;
}

export const handleSignup = async (
    form: HandleSignupProp,
): Promise<boolean> => {
    const names = form.fullName.trim().split(" ");
    const firstName = names[0];
    const lastName = names[names.length - 1];

    // 2. API Call
    try {
        const response = await fetch(
            "https://vsavebackend-31d8.onrender.com/user/register",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    firstName,
                    lastName,
                    email: form.email,
                    password: form.password,
                }),
            },
        );

        const data = await response.json();

        if (response.ok && data && data.status === "Success") {
            alert("Signup successful!");
            console.log("Signup successful!");
            return true;
        } else if (
            response.ok &&
            data &&
            data.status === "Failed" &&
            data.message.includes("already exists")
        ) {
            const toast = ToastAndroid;
            toast.show(
                "you already have an account with this email address.",
                ToastAndroid.LONG,
            );
        } else {
            // Handle server-side errors
            alert(data.message || "Signup failed. Please try again.");
            console.log("Signup failed. Please try again.");
            return false;
        }
    } catch (error) {
        // Handle network errors
        console.error("Signup error:", error);
        alert("Error Signing up please try again later.");
        return false;
    }
};

export const handleSignin = async (form: {
    email: string;
    password: string;
}): Promise<boolean> => {
    const login = useAuthStore.getState().login;
    try {
        const response = await fetch(
            "https://vsavebackend-31d8.onrender.com/user/login",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(form),
            },
        );

        const data = await response.json();

        if (data && data.status === "success") {
            login(data.token);
            alert("You have been logged in successfully!");
            return true;
        } else if (data && data.status === "failed") {
            alert(`an error occurred: ${data.message}`);
            return false;
        } else {
            data && "message" in data && data.message === "User not found"
                ? alert(
                      "You don't have an account please, create one to continue",
                  )
                : alert("an error occurred while logging in please try again");
            return false;
        }
    } catch (error) {
        alert("something went wrong, please try again later");
    }
};

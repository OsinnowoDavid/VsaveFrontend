import { Slot, useRouter, useSegments } from "expo-router";
import React, { useEffect } from "react";
import SplashScreen from "../components/SplashScreen";
import useAuthStore from "../store/useAuthStore";

const useProtectedRoute = () => {
    const { token, isAuthLoading } = useAuthStore();
    const segments = useSegments();
    const router = useRouter();

    useEffect(() => {
        // If the auth state is still loading, don't do anything.
        // A splash screen would be rendered here.
        if (isAuthLoading) return;

        const inAuthGroup = segments[0] === "auth";

        if (
            // If the user is not signed in and the initial segment is not in the auth group.
            !token &&
            !inAuthGroup
        ) {
            // Redirect to the login page.
            router.replace("/auth/login");
        } else if (token && inAuthGroup) {
            // Redirect away from the auth screens if the user is signed in.
            router.replace("/home");
        }
    }, [token, segments, isAuthLoading, router]);
};

export default function RootLayout() {
    useProtectedRoute();

    // This component can be replaced with a splash screen or loading indicator
    // while the auth state is being determined.
    const { isAuthLoading } = useAuthStore();
    if (isAuthLoading) {
        return <SplashScreen />;
    }

    return <Slot />;
}

import { Slot, useRouter, useSegments } from "expo-router";
import React, { useEffect, useRef } from "react";
import SplashScreen from "../components/SplashScreen";
import useAuthStore from "../store/useAuthStore";
import useProfileStore from "../store/useProfileStore";

/**
 * This hook is the key to decoupling the auth and profile stores.
 * It listens for changes in the auth token and triggers actions in the profile store.
 */

const { fetchProfile, clearProfile } = useProfileStore.getState();

const useAuthObserver = () => {
    const { token } = useAuthStore();
    // Actions are destructured outside the hook for stability.
    const wasInitiallyHydrated = useRef(false);

    useEffect(() => {
        // This effect runs when the token changes.
        if (token) {
            // User is logged in.
            fetchProfile(token);
        } else if (wasInitiallyHydrated.current) {
            // User logged out (and not the initial null state).
            clearProfile();
        }
        wasInitiallyHydrated.current = true;
    }, [token]);
};

const useProtectedRoute = () => {
    const { token, isAuthLoading } = useAuthStore();
    const { hasCompletedKYC, isProfileLoading, profile } = useProfileStore();
    const segments = useSegments();
    const router = useRouter();

    useEffect(() => {
        // If the auth state is still loading, don't do anything.
        // A splash screen would be rendered here.
        if (isAuthLoading || (token && isProfileLoading)) return;

        const inAuthGroup = segments[0] === "auth";

        // Condition 1: User is not logged in and not in the auth flow.
        // Redirect to login.
        if (!token && !inAuthGroup) {
            // Redirect to the auth group if the user is not signed in.
            router.replace("/auth/login");
            return;
        }

        // Condition 2: User is logged in, but KYC is not complete and they are not in the KYC flow.
        // Redirect to KYC screen.
        if (token && profile && !hasCompletedKYC && segments[1] !== "kyc") {
            // If user is logged in but hasn't completed KYC, redirect them.
            router.replace("/auth/kyc");
            return;
        }

        // Condition 3: User is logged in, has completed KYC, but is still in the auth group.
        // Redirect to home.
        if (token && hasCompletedKYC && inAuthGroup) {
            // Redirect away from the auth group if the user is signed in.
            router.replace("/home");
        }
    }, [token, segments, isAuthLoading, hasCompletedKYC, isProfileLoading]);
};

export default function RootLayout() {
    const { isAuthLoading, hydrate } = useAuthStore();

    useEffect(() => {
        hydrate();
    }, []);

    // These hooks manage the auth flow.
    useAuthObserver();
    useProtectedRoute();

    // While the token is loading, show a splash screen.
    if (isAuthLoading) {
        return <SplashScreen />;
    }

    return <Slot />;
}

import { Slot, useRouter, useSegments } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import SplashScreen from "../components/SplashScreen";
import { hasPin } from "../services/pinService";
import useAuthStore from "../store/useAuthStore";
import useProfileStore from "../store/useProfileStore";

// Create a QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes (formerly cacheTime)
      retry: 5,
    },
  },
});

/**
 * This hook is the key to decoupling the auth and profile stores.
 * It listens for changes in the auth token and triggers actions in the profile store.
 */
const useAuthObserver = () => {
  const { token } = useAuthStore();
  // Actions are destructured outside the hook for stability.
  const { fetchProfile, clearProfile } = useProfileStore.getState();
  const wasInitiallyHydrated = useRef(false);

  useEffect(() => {
    // This effect runs when the token changes.
    if (token) {
      // User is logged in.
      fetchProfile(token);
    } else if (wasInitiallyHydrated.current) {
      // User logged out (and not the initial null state).
      clearProfile();
      // Clear all queries when user logs out
      queryClient.clear();
    }
    wasInitiallyHydrated.current = true;
  }, [token]);
};

const useProtectedRoute = () => {
  const { token, hasCachedToken, isAuthLoading } = useAuthStore();
  const { hasCompletedKYC, isProfileLoading, profile } = useProfileStore();
  const segments = useSegments();
  const router = useRouter();
  const [pinStatus, setPinStatus] = useState({
    loading: true,
    hasPin: false,
  });

  // Effect to check for local PIN once user is authenticated
  useEffect(() => {
    if (token) {
      const checkPin = async () => {
        const userHasPin = await hasPin();
        setPinStatus({ loading: false, hasPin: userHasPin });
      };
      checkPin();
    } else {
      // If there's no token, no need to check for a PIN.
      setPinStatus({ loading: false, hasPin: false });
    }
  }, [token]);

  useEffect(() => {
    // If the auth state is still loading, don't do anything.
    // A splash screen would be rendered here.
    if (isAuthLoading || (token && (isProfileLoading || pinStatus.loading)))
      return;

    const inAuthGroup = segments[0] === "auth";

    // Condition 1: User is not logged in and is trying to access a protected route.
    // The root `index` screen is public (segments.length === 0).
    // The auth group is public.
    if (!token && !inAuthGroup && segments.length > 0) {
      // Redirect to the auth group if the user is not signed in and not on a public screen.
      router.replace("/auth/login");
      return;
    }

    // Condition 3: User is logged in and has KYC, but somehow still doesn't have a PIN.
    // This is a fallback. Redirect to PIN setup screen.
    if (
      token &&
      hasCompletedKYC &&
      !pinStatus.hasPin &&
      segments[1] !== "pincode-setup"
    ) {
      router.replace("/auth/pincode-setup");
      return;
    }

    // Condition 4: User is fully authenticated (token, KYC, PIN) but is still in an auth screen.
    // Redirect to home.
    if (token && hasCompletedKYC && pinStatus.hasPin && inAuthGroup) {
      // Redirect away from the auth group if the user is signed in.
      router.replace("/home");
    }
  }, [
    token,
    hasCachedToken,
    segments,
    isAuthLoading,
    hasCompletedKYC,
    isProfileLoading,
    pinStatus,
  ]);
};

function RootLayoutContent() {
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

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <RootLayoutContent />
    </QueryClientProvider>
  );
}
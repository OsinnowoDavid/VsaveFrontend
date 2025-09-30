import useAuthStore from "../store/useAuthStore";

interface HandleSignupProp {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const handleSignup = async (form: HandleSignupProp) => {
  // First, get the login action from the store
  const login = useAuthStore.getState().login;

  // 1. Validation
  if (form.password !== form.confirmPassword) {
    alert("Passwords do not match!");
    return; // Stop the function
  }

  // 2. API Call
  try {
    const response = await fetch("https://vsavebackend.onrender.com/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fullName: form.fullName,
        email: form.email,
        password: form.password,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      // 3. Authentication & State Update
      // Assuming your backend sends back a token on success
      const userToken = data.token;
      await login(userToken); // This will save the token and set isAuthenticated to true
      alert("Signup successful!");
      // The app will automatically redirect to the home screen
    } else {
      // Handle server-side errors
      alert(data.message || "Signup failed. Please try again.");
    }
  } catch (error) {
    // Handle network errors
    console.error("Signup error:", error);
    alert("Network error. Please check your connection.");
  }
};

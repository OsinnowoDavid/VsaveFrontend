# Vsave Frontend Repository

[![GitHub Repo Size](https://img.shields.io/github/repo-size/OsinnowoDavid/VsaveFrontend?style=flat-square)](https://github.com/OsinnowoDavid/VsaveFrontend)
[![GitHub Issues](https://img.shields.io/github/issues/OsinnowoDavid/VsaveFrontend?style=flat-square)](https://github.com/OsinnowoDavid/VsaveFrontend/issues)
[![License](https://img.shields.io/github/license/OsinnowoDavid/VsaveFrontend?style=flat-square)](https://github.com/OsinnowoDavid/VsaveFrontend/blob/main/LICENSE)
[![Typescript](https://img.shields.io/badge/TypeScript-4.9.5-blue?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React Native](https://img.shields.io/badge/React_Native-0.71.8-blue?style=flat-square&logo=react&logoColor=white)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-48.0.18-green?style=flat-square&logo=expo&logoColor=white)](https://expo.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.3.2-blue?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Zod](https://img.shields.io/badge/Zod-3.21.4-yellow?style=flat-square)]

![Vsave Logo](./assets/images/web-app-manifest-192x192.png)

This repository contains the official frontend application for **Vsave**, a digital savings and wallet platform. It is built with React Native and Expo, providing a seamless mobile experience for users to manage their finances.

---

## Implemented Features

-   **User Authentication:** Secure sign-up flow with robust, real-time form validation.
-   **Custom Form Components:** Reusable and validated components for various inputs:
    -   **Phone Input:** A custom-built, searchable country code picker.
    -   **Date Picker:** Native date picker for a smooth user experience.
    -   **Standard Fields:** Consistently styled and validated fields for text, email, and passwords.

---

## Tech Stack

This project is built using the following technologies:

-   **Framework:** React Native with Expo SDK.
-   **Language:** TypeScript.
-   **Styling:** Tailwind CSS (via `nativewind`).
-   **State Management:** React Hooks (`useState`, `useEffect`).
-   **Form Validation:** Zod for schema-based validation.
-   **UI Components:**
    -   `@react-native-picker/picker`
    -   `@react-native-community/datetimepicker`
-   **Icons:** `lucide-react-native`.
-   **Utilities:** `country-state-city` for country and phone code data.

---

## Project Structure

The project follows a standard Expo application structure:

-   `app/`: Contains all the screens and navigation logic (using Expo Router).
-   `components/`: Houses reusable components used across the application (e.g., `Button`, `FormField`, `PhoneInput`).
-   `hooks/`: For custom React hooks (e.g., `useKeyboardVisible`).
-   `schema/`: Zod schemas for form and data validation.
-   `services/`: Functions for interacting with the backend API.
-   `utils/`: Helper functions and utilities.

---

## Installation

Follow these steps to get the project up and running on your local machine.

1. **Clone the repository**

    ```bash
    git clone https://github.com/OsinnowoDavid/VsaveFrontend.git
    ```

2. **Navigate to the project directory**

    ```bash
    cd Vsave
    ```

3. **Install the dependencies**

    ```bash
    npm install
    ```

    or

    ```bash
    yarn
    ```

---

## Usage

After installation, you can run the app in different ways:

-   **Run on a local development server**

    ```bash
    npm start
    ```

    This will open the Expo DevTools in your browser. From there, you can scan the QR code with the Expo Go app on your phone to see the app running on your device, or choose to run it on an iOS or Android simulator/emulator.

---

## Contributing

We welcome contributions to the Vsave project! To contribute, follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature-name`).
3. Make your changes and commit them (`git commit -m 'Add a new feature'`).
4. Push to the branch (`git push origin feature/your-feature-name`).
5. Open a Pull Request.

---

## License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT).

---

## Contact

You can reach me via my GitHub profile at [https://github.com/OsinnowoDavid](https://github.com/OsinnowoDavid).

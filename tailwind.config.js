/** @type {import('tailwindcss').Config} */
module.exports = {
    presets: [require("nativewind/preset")], // <-- Add this line
    content: ["./app/**/*.{js,tsx,ts,jsx}", "./components/*.{js,tsx,ts,jsx}"],
    theme: {
        extend: {},
    },
    plugins: [],
};

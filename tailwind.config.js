/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require("nativewind/preset")], // <-- Add this line
  content: [
    './app/**/*.{js,tsx,ts,jsx}',
    // Add other directories if needed
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
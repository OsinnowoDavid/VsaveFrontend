/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require("nativewind/preset")], // <-- Add this line
  content: [
    "./app/**/*.{js,tsx,ts,jsx}",
    // Add other directories if needed
  ],
  safelist: [
    "bg-green-700",
    "bg-white",
    "bg-transparent",
    "border-[1px]",
    "border-white",
    "border-gray-300",
    "text-gray-700",
    "px-3",
    "py-2",
    "py-3",
    "rounded-md",
    "rounded-lg",
    "rounded-xl",
    "rounded-2xl",
    "w-12",
    "h-12",
    "item-center",
    "justify-center",
    "flex-row",
    "gap-2",
    "mb-2",
    "mb-4",
    "mb-6",
    "text-lg",
    "text-xl",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

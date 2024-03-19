/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./node_modules/flowbite-react/lib/**/*.js",
    ],
    theme: {
        extend: {
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "gradient-conic":
                    "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
            },
            fontFamily: {
                roboto: ["Roboto", "sans-serif"],
            },
            colors: {
                primary: "#2a8178",
                secondary: "#3aa89b",
                lightgreen1: "#dcf7f4",
                lightgreen2: "#f9fffe",
                grey: "#68738d",
            },
        },
    },
    plugins: [require("flowbite/plugin")],
}

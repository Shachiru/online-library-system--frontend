/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class', // Enable class-based dark mode
    theme: {
        extend: {
            colors: {
                // Your custom color palette
                'primary-black': '#000000',
                'primary-mint': '#CFFFE2',
                'primary-teal': '#A2D5C6',
                'primary-white': '#F6F6F6',
                'dark-teal': '#5A9586',
                'dark-bg': '#1A1A1A',
                'darker-bg': '#0A1512',
            }
        },
    },
    plugins: [],
}
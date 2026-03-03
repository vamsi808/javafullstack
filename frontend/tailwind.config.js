/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                background: {
                    start: '#0f172a',
                    end: '#1e293b',
                },
                primary: {
                    DEFAULT: '#3b82f6',
                    hover: '#2563eb',
                },
                secondary: {
                    DEFAULT: '#8b5cf6',
                    hover: '#7c3aed',
                },
                danger: '#ef4444',
                success: '#10b981',
            },
        },
    },
    plugins: [],
}

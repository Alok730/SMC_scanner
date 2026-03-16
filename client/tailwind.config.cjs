module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                dark: {
                    bg: '#0a0a0c',
                    card: 'rgba(23, 23, 26, 0.7)',
                    border: 'rgba(255, 255, 255, 0.1)',
                },
                accent: {
                    primary: '#3b82f6',
                    secondary: '#6366f1',
                    bull: '#10b981',
                    bear: '#ef4444',
                }
            },
            backdropBlur: {
                xs: '2px',
            }
        },
    },
    plugins: [],
}

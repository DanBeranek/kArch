module.exports = {
    content: ["./**/*.html"],
    theme: {
        container: {
            center: true,
        },
        extend: {
            colors: {
                primary: {
                    DEFAULT:'#AB7345',
                    50: '#FFFDF5',     // Ultra Light
                    100: '#FFF7F0',    // Very Light
                    200: '#FFE2D1',    // Light
                    300: '#FFC3A3',    // Light-Medium
                    400: '#FFA275',    // Medium-Light
                    500: '#AB7345',    // Base Color
                    600: '#94403A',    // Medium-Dark
                    700: '#7A342F',    // Dark
                    800: '#612224',    // Very Dark
                    900: '#481819',    // Extreme Dark
                    950: '#2F0F13',    // Ultra Dark
                }
            },
        },
    },
    variants: {},
    plugins: [require("@tailwindcss/typography")],
};
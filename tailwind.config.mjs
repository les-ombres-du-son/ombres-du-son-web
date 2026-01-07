/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
    theme: {
        extend: {
            colors: {
                primary: '#FF6B35',
                secondary: '#004E89',
                accent: '#F7B801',
                'bg-light': '#F8F9FA',
                'bg-dark': '#1A1A1A',
                'text-light': '#FFFFFF',
                'text-dark': '#2D2D2D',
                focus: '#00D9FF',
                error: '#E63946',
                success: '#06FFA5',
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                display: ['Space Grotesk', 'system-ui', 'sans-serif'],
                mono: ['JetBrains Mono', 'monospace'],
            },
            fontSize: {
                'display-xl': 'clamp(3rem, 12vw, 10rem)',
                'display-lg': 'clamp(2.5rem, 10vw, 8rem)',
                'display-md': 'clamp(2rem, 8vw, 6rem)',
                'display-sm': 'clamp(1.5rem, 6vw, 4rem)',
                'body-lg': 'clamp(1.125rem, 2vw, 1.5rem)',
                'body-md': 'clamp(1rem, 1.5vw, 1.25rem)',
            },
            animation: {
                'fade-in': 'fadeIn 0.6s ease-out',
                'slide-up': 'slideUp 0.6s ease-out',
                'scale-in': 'scaleIn 0.4s ease-out',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { opacity: '0', transform: 'translateY(30px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                scaleIn: {
                    '0%': { opacity: '0', transform: 'scale(0.95)' },
                    '100%': { opacity: '1', transform: 'scale(1)' },
                },
            },
        },
    },
    plugins: [],
};

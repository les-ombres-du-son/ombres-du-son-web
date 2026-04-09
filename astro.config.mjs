import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
    integrations: [
        react(),
        tailwind({
            applyBaseStyles: false,
        }),
    ],
    output: 'static',
    build: {
        inlineStylesheets: 'auto',
    },
    vite: {
        resolve: {
            alias: {
                '@': '/src',
                '@components': '/src/components',
                '@layouts': '/src/layouts',
                '@styles': '/src/styles',
            },
        },
        ssr: {
            noExternal: ['gsap'],
        },
    },
});

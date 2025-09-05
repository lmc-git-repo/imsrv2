import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        laravel({
            input: 'resources/js/app.jsx',
            refresh: true,
        }),
        react(),
    ],
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    vendor: ['react', 'react-dom', '@inertiajs/react'],
                    ui: ['@headlessui/react', 'flowbite', 'flowbite-react'],
                },
            },
        },
    },
    // server: {
    //     // host: '192.168.18.30', //home Ip
    //     host: '10.208.10.201', // This allows access from any IP on your network
    //     port: 5173,      // Default Vite port, change if necessary
    // },
});

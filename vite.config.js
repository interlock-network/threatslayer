import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue()],
    build: {
        emptyOutDir: false,
        rollupOptions: {
            output: {
                assetFileNames: (assetInfo) => {
                    let extType = assetInfo.name.split('.').at(1);
                    if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
                        extType = 'img';
                    }
                    return `[name]-[hash][extname]`;
                },
                chunkFileNames: '[name]-[hash].js',
                entryFileNames: '[name]-[hash].js',
            },
        },
    },
    logLevel: 'warn',
    server: { port: 8080 },
    base: '/',
    resolve: {
        alias: [
            {
                find: '@',
                replacement: path.resolve(__dirname, 'src')
            }
        ]
    }
})

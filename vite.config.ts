import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import fs from 'fs';
import path from 'path';
import vue from '@vitejs/plugin-vue';
import vueDevTools from 'vite-plugin-vue-devtools';
import tailwindcss from '@tailwindcss/vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
    plugins: [
        vue(),
        vueDevTools(),
        tailwindcss()
    ],
    resolve: {
        alias: {
          '@': fileURLToPath(new URL('./src', import.meta.url))
        },
    },
    server: {
        host: 'strawberry.local',
        port: 5173,
        // Local mkcert HTTPS certs — only needed to run the dev server, not to build. Reading
        // them unconditionally breaks `vite build` wherever these sibling-directory cert files
        // don't exist (e.g. Render), since Vite evaluates this whole config file for build too.
        ...(command === 'serve' && {
            https: {
                key: fs.readFileSync('../strawberry.local+2-key.pem'),
                cert: fs.readFileSync('../strawberry.local+2.pem'),
            }
        })
    }
}))

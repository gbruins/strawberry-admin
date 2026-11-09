import { fileURLToPath } from 'node:url'
import { mergeConfig, defineConfig, configDefaults } from 'vitest/config'
import viteConfig from './vite.config'

// vite.config.ts exports a function (it branches on `command`), and mergeConfig() can't merge
// a callback — resolve it with the same env first.
export default defineConfig((env) => mergeConfig(
    viteConfig(env),
    {
        test: {
            environment: 'jsdom',
            exclude: [...configDefaults.exclude, 'e2e/**'],
            root: fileURLToPath(new URL('./', import.meta.url)),
        },
    },
))

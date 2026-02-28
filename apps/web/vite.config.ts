import { defineConfig, loadEnv } from 'vite'

import path from 'path'
import react from '@vitejs/plugin-react'
import mdx from '@mdx-js/rollup'
import remarkFrontmatter from 'remark-frontmatter'
import remarkMdxFrontmatter from 'remark-mdx-frontmatter'
import remarkGfm from 'remark-gfm'
import viteMdxSanitize from './src/plugins/vite-mdx-sanitize'

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd())

    return {
        plugins: [
            viteMdxSanitize(),
            mdx({
                remarkPlugins: [remarkGfm, remarkFrontmatter, remarkMdxFrontmatter]
            }),
            react()
        ],
        resolve: {
            alias: {
                '@': path.resolve(__dirname, './src')
            },
            dedupe: [
                '@codemirror/state',
                '@codemirror/view',
                '@codemirror/language',
                '@lezer/common',
                '@lezer/highlight',
                '@lezer/lr',
                '@xterm/xterm'
            ]
        },
        build: {
            rollupOptions: {
                output: {
                    manualChunks: {
                        'framer-motion': ['framer-motion'],
                        'react-flow': ['@xyflow/react'],
                        codemirror: [
                            '@codemirror/state',
                            '@codemirror/view',
                            '@codemirror/language',
                            '@codemirror/lang-json'
                        ],
                        phosphor: ['@phosphor-icons/react']
                    }
                }
            }
        },
        server: {
            port: Number(env.VITE_PORT) || 1111,
            proxy: {
                '/ws': {
                    target: `ws://localhost:${env.VITE_WS_PORT}`,
                    ws: true
                },
                '/api': {
                    target: `http://localhost:${env.VITE_API_PORT}`,
                    changeOrigin: true,
                    rewrite: (path) => path.replace(/^\/api/, '')
                }
            }
        }
    }
})
import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import mdx from '@mdx-js/rollup'
import remarkFrontmatter from 'remark-frontmatter'
import remarkMdxFrontmatter from 'remark-mdx-frontmatter'
import remarkGfm from 'remark-gfm'

export default defineConfig({
    plugins: [
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
            '@lezer/lr'
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
        port: 1111,
        proxy: {
            '/api': {
                target: 'http://localhost:2222',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, '')
            }
        }
    }
})
import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const keepAlive = () => ({
    name: 'keep-alive',
    configureServer() {
        process.stdin.removeAllListeners('end')
        process.stdin.resume()
    }
})

export default defineConfig({
    plugins: [keepAlive(), react()],
    resolve: {
        alias: {
            '@/': path.resolve(__dirname, '../web/src') + '/',
            '@electron/': path.resolve(__dirname, './src/renderer') + '/'
        }
    },
    server: {
        proxy: {
            '/api': {
                target: 'http://localhost:2222',
                changeOrigin: true
            }
        }
    }
})
export const register = async () => {
    if (process.env.NEXT_RUNTIME === 'nodejs') {
        const http = await import('http')
        const { default: setupTerminalSocket } = await import('@/services/terminalSocket')

        const wsPort = Number(process.env.WS_PORT) || 2223
        const wsServer = http.createServer()
        setupTerminalSocket(wsServer)
        wsServer.listen(wsPort)
    }
}
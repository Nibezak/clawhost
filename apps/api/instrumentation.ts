export const register = async () => {
    if (process.env.NEXT_RUNTIME === 'nodejs' && process.env.WS_PORT) {
        const http = await import('http')

        const { default: setupTerminalSocket } =
            await import('@/services/terminalSocket')

        const wsPort = Number(process.env.WS_PORT)
        const wsServer = http.createServer()

        setupTerminalSocket(wsServer)

        wsServer.listen(wsPort)
    }
}
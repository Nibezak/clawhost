import http from 'http'
import https from 'https'
import fs from 'fs'
import net from 'net'
import configStore from '@/main/services/configStore'
import certManager from '@/main/services/certManager'

const PROXY_PORT = 18700
const HTTPS_PROXY_PORT = 18701
let server: http.Server | null = null
let httpsServer: https.Server | null = null

const extractSubdomain = (host: string | undefined): string | null => {
    if (!host) return null
    const hostname = host.split(':')[0]
    if (!hostname.endsWith('.clawhost')) return null
    return hostname.replace('.clawhost', '')
}

const resolveClaw = (subdomain: string): { port: number; gatewayToken: string } | null => {
    const claw = configStore.findClawBySubdomain(subdomain)
    if (!claw) return null
    return { port: claw.port, gatewayToken: claw.gatewayToken }
}

const injectToken = (url: string, token: string): string => {
    if (!token) return url
    const separator = url.includes('?') ? '&' : '?'
    return `${url}${separator}token=${token}`
}

const handleRequest = (
    req: http.IncomingMessage,
    res: http.ServerResponse
): void => {
    const subdomain = extractSubdomain(req.headers.host)
    if (!subdomain) {
        res.writeHead(404)
        res.end()
        return
    }

    const claw = resolveClaw(subdomain)
    if (!claw) {
        res.writeHead(404)
        res.end()
        return
    }

    const proxyReq = http.request(
        {
            hostname: '127.0.0.1',
            port: claw.port,
            path: injectToken(req.url || '/', claw.gatewayToken),
            method: req.method,
            headers: req.headers
        },
        (proxyRes) => {
            res.writeHead(proxyRes.statusCode || 502, proxyRes.headers)
            proxyRes.pipe(res)
        }
    )

    proxyReq.on('error', () => {
        res.writeHead(502)
        res.end()
    })

    req.pipe(proxyReq)
}

const handleUpgrade = (
    req: http.IncomingMessage,
    socket: net.Socket,
    head: Buffer
): void => {
    const subdomain = extractSubdomain(req.headers.host)
    if (!subdomain) {
        socket.destroy()
        return
    }

    const claw = resolveClaw(subdomain)
    if (!claw) {
        socket.destroy()
        return
    }

    const proxySocket = net.connect(claw.port, '127.0.0.1', () => {
        const requestLine = `${req.method} ${injectToken(req.url || '/', claw.gatewayToken)} HTTP/1.1\r\n`
        let headers = ''
        for (let i = 0; i < req.rawHeaders.length; i += 2) {
            headers += `${req.rawHeaders[i]}: ${req.rawHeaders[i + 1]}\r\n`
        }
        proxySocket.write(requestLine + headers + '\r\n')
        if (head.length > 0) {
            proxySocket.write(head)
        }
        proxySocket.pipe(socket)
        socket.pipe(proxySocket)
    })

    proxySocket.on('error', () => {
        socket.destroy()
    })

    socket.on('error', () => {
        proxySocket.destroy()
    })
}

const start = (): void => {
    if (server) return

    server = http.createServer(handleRequest)
    server.on('upgrade', handleUpgrade)
    server.listen(PROXY_PORT, '127.0.0.1')

    const certPaths = certManager.getCertPaths()
    if (certPaths) {
        httpsServer = https.createServer(
            {
                key: fs.readFileSync(certPaths.key),
                cert: fs.readFileSync(certPaths.cert),
                ca: fs.readFileSync(certPaths.ca)
            },
            handleRequest
        )
        httpsServer.on('upgrade', handleUpgrade)
        httpsServer.listen(HTTPS_PROXY_PORT, '127.0.0.1')
    }
}

const reloadCerts = (): void => {
    if (!httpsServer) return
    const certPaths = certManager.getCertPaths()
    if (!certPaths) return
    httpsServer.setSecureContext({
        key: fs.readFileSync(certPaths.key),
        cert: fs.readFileSync(certPaths.cert),
        ca: fs.readFileSync(certPaths.ca)
    })
}

const stop = (): void => {
    if (server) {
        server.close()
        server = null
    }
    if (httpsServer) {
        httpsServer.close()
        httpsServer = null
    }
}

export default { start, stop, reloadCerts }
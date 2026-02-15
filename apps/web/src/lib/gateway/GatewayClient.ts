import type { GatewayConnectionState, GatewayEventHandler } from '@/ts/Types'
import type { GatewayPendingRequest } from '@/ts/Interfaces'

import getBaseDomain from '@/lib/getBaseDomain'

const REQUEST_TIMEOUT = 15000
const MAX_RECONNECT_DELAY = 30000

class GatewayClient {
    private ws: WebSocket | null = null
    private token: string
    private subdomain: string
    private requestId = 0
    private pending = new Map<string, GatewayPendingRequest>()
    private listeners = new Map<string, Set<GatewayEventHandler>>()
    private _state: GatewayConnectionState = 'disconnected'
    private onStateChange: ((state: GatewayConnectionState) => void) | null =
        null
    private reconnectAttempts = 0
    private reconnectTimer: ReturnType<typeof setTimeout> | null = null
    private intentionalClose = false

    constructor(
        subdomain: string,
        token: string,
        onStateChange?: (state: GatewayConnectionState) => void
    ) {
        this.subdomain = subdomain
        this.token = token
        this.onStateChange = onStateChange || null
    }

    get state(): GatewayConnectionState {
        return this._state
    }

    private setState(state: GatewayConnectionState): void {
        this._state = state
        this.onStateChange?.(state)
    }

    connect(): void {
        if (this.ws) return

        this.intentionalClose = false
        this.setState('connecting')

        const domain = getBaseDomain()
        const url = `wss://${this.subdomain}.${domain}/`

        try {
            this.ws = new WebSocket(url)
        } catch {
            this.setState('error')
            this.scheduleReconnect()
            return
        }

        this.ws.onopen = () => {}

        this.ws.onmessage = (event) => {
            try {
                const frame = JSON.parse(event.data as string) as Record<
                    string,
                    unknown
                >
                this.handleFrame(frame)
            } catch {
                /* malformed frame */
            }
        }

        this.ws.onclose = () => {
            this.ws = null
            if (!this.intentionalClose) {
                this.setState('disconnected')
                this.scheduleReconnect()
            }
        }

        this.ws.onerror = () => {
            if (this._state === 'connecting') {
                this.setState('error')
            }
        }
    }

    private handleFrame(frame: Record<string, unknown>): void {
        const type = frame.type as string

        if (type === 'event') {
            const eventName = frame.event as string

            if (eventName === 'connect.challenge') {
                this.handleChallenge()
                return
            }

            const handlers = this.listeners.get(eventName)
            if (handlers) {
                handlers.forEach((handler) => handler(frame.payload))
            }
            return
        }

        if (type === 'res') {
            const id = frame.id as string
            const pendingReq = this.pending.get(id)
            if (!pendingReq) return

            clearTimeout(pendingReq.timer)
            this.pending.delete(id)

            if (frame.ok) {
                if (
                    this._state === 'authenticating' &&
                    (frame.payload as Record<string, unknown>)?.type ===
                        'hello-ok'
                ) {
                    this.reconnectAttempts = 0
                    this.setState('connected')
                }
                pendingReq.resolve(frame.payload)
            } else {
                const error = frame.error as Record<string, unknown> | undefined
                pendingReq.reject(
                    new Error((error?.message as string) || 'Request failed')
                )
            }
        }
    }

    private handleChallenge(): void {
        this.setState('authenticating')

        const id = this.nextId()
        const params = {
            minProtocol: 3,
            maxProtocol: 3,
            client: {
                id: 'gateway-client',
                displayName: 'clawhost-chat',
                version: '1.0.0',
                platform: this.detectPlatform(),
                mode: 'ui',
                instanceId: crypto.randomUUID()
            },
            role: 'operator',
            scopes: ['operator.admin'],
            auth: { token: this.token }
        }

        this.sendRaw({
            type: 'req',
            id,
            method: 'connect',
            params
        })

        const timer = setTimeout(() => {
            this.pending.delete(id)
            this.setState('error')
        }, REQUEST_TIMEOUT)

        this.pending.set(id, {
            resolve: () => {},
            reject: () => {
                this.setState('error')
            },
            timer
        })
    }

    send(method: string, params: unknown): Promise<unknown> {
        return new Promise((resolve, reject) => {
            if (!this.ws || this._state !== 'connected') {
                reject(new Error('Not connected'))
                return
            }

            const id = this.nextId()
            const timer = setTimeout(() => {
                this.pending.delete(id)
                reject(new Error('Request timed out'))
            }, REQUEST_TIMEOUT)

            this.pending.set(id, { resolve, reject, timer })

            this.sendRaw({
                type: 'req',
                id,
                method,
                params
            })
        })
    }

    on(event: string, handler: GatewayEventHandler): void {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, new Set())
        }
        this.listeners.get(event)!.add(handler)
    }

    off(event: string, handler: GatewayEventHandler): void {
        this.listeners.get(event)?.delete(handler)
    }

    disconnect(): void {
        this.intentionalClose = true

        if (this.reconnectTimer) {
            clearTimeout(this.reconnectTimer)
            this.reconnectTimer = null
        }

        this.pending.forEach((req) => {
            clearTimeout(req.timer)
            req.reject(new Error('Disconnected'))
        })
        this.pending.clear()
        this.listeners.clear()

        if (this.ws) {
            this.ws.onclose = null
            this.ws.onerror = null
            this.ws.onmessage = null
            this.ws.close()
            this.ws = null
        }

        this.setState('disconnected')
    }

    private sendRaw(frame: Record<string, unknown>): void {
        if (this.ws?.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify(frame))
        }
    }

    private nextId(): string {
        this.requestId += 1
        return `req-${this.requestId}`
    }

    private detectPlatform(): string {
        const ua = navigator.userAgent.toLowerCase()
        if (ua.includes('mac')) return 'macos'
        if (ua.includes('win')) return 'windows'
        if (ua.includes('android')) return 'android'
        if (ua.includes('iphone') || ua.includes('ipad')) return 'ios'
        return 'linux'
    }

    private scheduleReconnect(): void {
        if (this.intentionalClose) return

        const delay = Math.min(
            1000 * Math.pow(2, this.reconnectAttempts),
            MAX_RECONNECT_DELAY
        )
        this.reconnectAttempts += 1

        this.reconnectTimer = setTimeout(() => {
            this.reconnectTimer = null
            this.connect()
        }, delay)
    }
}

export default GatewayClient
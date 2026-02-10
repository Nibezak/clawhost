export interface RequestOptions extends Omit<RequestInit, 'body'> {
    body?: unknown
}

export interface RequestConfig {
    baseUrl: string
    getHeaders?: () => Promise<Record<string, string>> | Record<string, string>
    onUnauthorized?: () => Promise<void>
}
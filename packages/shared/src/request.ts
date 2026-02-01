export interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown
}

export interface RequestConfig {
  baseUrl: string
  getHeaders?: () => Promise<Record<string, string>> | Record<string, string>
}

export class RequestClient {
  private config: RequestConfig

  constructor(config: RequestConfig) {
    this.config = config
  }

  async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { body, ...init } = options

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(this.config.getHeaders ? await this.config.getHeaders() : {}),
      ...((init.headers as Record<string, string>) || {}),
    }

    const res = await fetch(`${this.config.baseUrl}${endpoint}`, {
      ...init,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    })

    const contentType = res.headers.get('content-type')
    let data: unknown

    if (contentType?.includes('application/json')) {
      data = await res.json()
    } else {
      const text = await res.text()
      if (!res.ok) {
        throw new Error(text || `Request failed: ${res.status}`)
      }
      data = text
    }

    if (!res.ok) {
      const errorData = data as {
        error?: string | { message?: string; code?: string }
        message?: string
      }
      let errorMessage = `Request failed: ${res.status}`

      if (typeof errorData?.error === 'string') {
        errorMessage = errorData.error
      } else if (typeof errorData?.error === 'object' && errorData.error?.message) {
        errorMessage = errorData.error.message
      } else if (errorData?.message) {
        errorMessage = errorData.message
      }

      throw new Error(errorMessage)
    }

    return data as T
  }

  get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' })
  }

  post<T>(endpoint: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'POST', body })
  }

  put<T>(endpoint: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'PUT', body })
  }

  delete<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' })
  }
}

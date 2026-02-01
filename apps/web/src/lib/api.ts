import { RequestClient } from '@openclaw/shared'
import { auth } from './firebase'

// Helper to wait for auth to be ready
const getAuthToken = async (): Promise<string | null> => {
  // If user is already available, get token immediately
  if (auth.currentUser) {
    return auth.currentUser.getIdToken()
  }

  // Wait for auth state to be ready (max 5 seconds)
  return new Promise((resolve) => {
    const timeout = setTimeout(() => {
      resolve(null)
    }, 5000)

    const unsubscribe = auth.onAuthStateChanged((user) => {
      clearTimeout(timeout)
      unsubscribe()
      if (user) {
        user.getIdToken().then(resolve).catch(() => resolve(null))
      } else {
        resolve(null)
      }
    })
  })
}

const client = new RequestClient({
  baseUrl: '/api',
  getHeaders: async (): Promise<Record<string, string>> => {
    const token = await getAuthToken()
    return token ? { Authorization: `Bearer ${token}` } : {}
  },
})

export interface Volume {
  id: string
  name: string
  size: number
  status: string
}

export interface Instance {
  id: string
  name: string
  // Hetzner statuses: initializing, starting, running, stopping, off, deleting, migrating, rebuilding, unknown
  status: 'initializing' | 'starting' | 'running' | 'stopping' | 'off' | 'stopped' | 'deleting' | 'migrating' | 'rebuilding' | 'unknown' | 'creating'
  ip: string | null
  planId: string
  location: string | null
  rootPassword: string | null
  sshKeyId: string | null
  hetznerServerId: string | null
  subdomain: string | null
  volumes?: Volume[]
  createdAt: string
}

export interface VolumePricing {
  pricePerGbMonthly: number
  minSize: number
  maxSize: number
}

export interface Plan {
  id: string
  name: string
  cpu: number
  memory: number
  disk: number
  priceHourly: number
  priceMonthly: number
  architecture: string
}

export interface Location {
  id: string
  name: string
  city: string
  country: string
}

export interface SSHKey {
  id: string
  name: string
  fingerprint: string
  publicKey: string
  createdAt: string
}

export interface UserProfile {
  id: string
  email: string
  name: string | null
  createdAt: string
}

export interface UserStats {
  instanceCount: number
}

export const api = {
  // Plans & Locations
  getPlans: () => client.get<Plan[]>('/plans'),
  getLocations: () => client.get<Location[]>('/plans/locations'),
  getVolumePricing: () => client.get<VolumePricing>('/plans/volume-pricing'),

  // Instances
  getInstances: (sync?: boolean) => client.get<Instance[]>(`/instances${sync ? '?sync=true' : ''}`),
  getInstance: (id: string, sync?: boolean) => client.get<Instance>(`/instances/${id}${sync ? '?sync=true' : ''}`),
  syncInstance: (id: string) => client.post<Instance>(`/instances/${id}/sync`),
  createInstance: (data: {
    name: string
    planId: string
    location: string
    password?: string
    sshKeyId?: string
    volumeSize?: number
  }) => client.post<Instance>('/instances', data),
  startInstance: (id: string) => client.post<void>(`/instances/${id}/start`),
  stopInstance: (id: string) => client.post<void>(`/instances/${id}/stop`),
  restartInstance: (id: string) => client.post<void>(`/instances/${id}/restart`),
  deleteInstance: (id: string) => client.delete<void>(`/instances/${id}`),

  // SSH Keys
  getSSHKeys: () => client.get<SSHKey[]>('/ssh-keys'),
  createSSHKey: (data: { name: string; publicKey: string }) =>
    client.post<SSHKey>('/ssh-keys', data),
  deleteSSHKey: (id: string) => client.delete<void>(`/ssh-keys/${id}`),

  // User Profile
  getProfile: () => client.get<UserProfile>('/users/me'),
  updateProfile: (data: { name?: string }) =>
    client.put<UserProfile>('/users/me', data),
  getUserStats: () => client.get<UserStats>('/users/me/stats'),
}

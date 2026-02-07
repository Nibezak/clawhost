import { RequestClient } from '@openclaw/shared'

function getClient() {
  const token = process.env.HETZNER_API_TOKEN
  if (!token) {
    throw new Error('HETZNER_API_TOKEN is not set')
  }

  return new RequestClient({
    baseUrl: 'https://api.hetzner.cloud/v1',
    getHeaders: () => ({ Authorization: `Bearer ${token}` }),
  })
}

interface HetznerServer {
  id: number
  name: string
  status: string
  public_net: {
    ipv4: { ip: string }
  }
}

interface HetznerSSHKey {
  id: number
  name: string
  fingerprint: string
  public_key: string
  created: string
}

interface ServerType {
  id: number
  name: string
  description: string
  cores: number
  memory: number
  disk: number
  architecture: string
  prices: Array<{
    location: string
    price_hourly: { gross: string }
    price_monthly: { gross: string }
  }>
}

interface Location {
  id: number
  name: string
  description: string
  country: string
  city: string
}

interface HetznerVolume {
  id: number
  name: string
  size: number
  location: { name: string }
  server: number | null
  status: string
  created: string
}

interface VolumePricing {
  price_per_gb_month: { gross: string }
}

export const hetzner = {
  // Server operations
  async createServer(
    name: string,
    serverType: string,
    location: string,
    rootPassword?: string,
    sshKeyIds?: number[],
    snapshotId?: string,
    userData?: string
  ): Promise<{ serverId: number; ip: string; rootPassword: string }> {
    const body: Record<string, unknown> = {
      name,
      server_type: serverType,
      location,
      start_after_create: true,
      image: snapshotId || 'ubuntu-24.04',
    }

    if (rootPassword) {
      body.root_password = rootPassword
    }

    if (sshKeyIds?.length) {
      body.ssh_keys = sshKeyIds
    }

    if (userData) {
      body.user_data = userData
    }

    const data = await getClient().post<{
      server: HetznerServer
      root_password: string
    }>('/servers', body)

    return {
      serverId: data.server.id,
      ip: data.server.public_net.ipv4.ip,
      rootPassword: data.root_password,
    }
  },

  async getServer(serverId: string): Promise<{ status: string; ip: string }> {
    const data = await getClient().get<{ server: HetznerServer }>(`/servers/${serverId}`)
    return {
      status: data.server.status,
      ip: data.server.public_net.ipv4.ip,
    }
  },

  async startServer(serverId: string): Promise<void> {
    await getClient().post(`/servers/${serverId}/actions/poweron`)
  },

  async stopServer(serverId: string): Promise<void> {
    await getClient().post(`/servers/${serverId}/actions/shutdown`)
  },

  async restartServer(serverId: string): Promise<void> {
    await getClient().post(`/servers/${serverId}/actions/reboot`)
  },

  async deleteServer(serverId: string): Promise<void> {
    await getClient().delete(`/servers/${serverId}`)
  },

  // Server types
  async getServerTypes(): Promise<
    Array<{
      name: string
      description: string
      cores: number
      memory: number
      disk: number
      architecture: string
      priceHourly: number
      priceMonthly: number
    }>
  > {
    const data = await getClient().get<{ server_types: ServerType[] }>('/server_types')

    return data.server_types.map((t) => {
      const ashPrice = t.prices.find((p) => p.location === 'ash')
      const price = ashPrice || t.prices[0]

      return {
        name: t.name,
        description: t.description,
        cores: t.cores,
        memory: t.memory,
        disk: t.disk,
        architecture: t.architecture,
        priceHourly: parseFloat(price.price_hourly.gross),
        priceMonthly: parseFloat(price.price_monthly.gross),
      }
    })
  },

  // Locations
  async getLocations(): Promise<
    Array<{ id: string; name: string; city: string; country: string }>
  > {
    const data = await getClient().get<{ locations: Location[] }>('/locations')

    return data.locations.map((l) => ({
      id: l.name,
      name: l.description,
      city: l.city,
      country: l.country,
    }))
  },

  // SSH Keys
  async getSSHKeys(): Promise<
    Array<{
      id: number
      name: string
      fingerprint: string
      publicKey: string
      createdAt: string
    }>
  > {
    const data = await getClient().get<{ ssh_keys: HetznerSSHKey[] }>('/ssh_keys')

    return data.ssh_keys.map((k) => ({
      id: k.id,
      name: k.name,
      fingerprint: k.fingerprint,
      publicKey: k.public_key,
      createdAt: k.created,
    }))
  },

  async createSSHKey(
    name: string,
    publicKey: string
  ): Promise<{ id: number; name: string; fingerprint: string }> {
    const data = await getClient().post<{ ssh_key: HetznerSSHKey }>('/ssh_keys', {
      name,
      public_key: publicKey,
    })

    return {
      id: data.ssh_key.id,
      name: data.ssh_key.name,
      fingerprint: data.ssh_key.fingerprint,
    }
  },

  async deleteSSHKey(keyId: number): Promise<void> {
    await getClient().delete(`/ssh_keys/${keyId}`)
  },

  // Volumes
  async getVolumePricing(): Promise<{ pricePerGbMonthly: number }> {
    const data = await getClient().get<{ pricing: { volume: VolumePricing } }>('/pricing')
    return {
      pricePerGbMonthly: parseFloat(data.pricing.volume.price_per_gb_month.gross),
    }
  },

  async createVolume(
    name: string,
    size: number,
    location: string,
    serverId?: number
  ): Promise<{ id: number; size: number; location: string }> {
    const body: Record<string, unknown> = {
      name,
      size,
      location,
      automount: true,
      format: 'ext4',
    }

    if (serverId) {
      body.server = serverId
    }

    const data = await getClient().post<{ volume: HetznerVolume }>('/volumes', body)

    return {
      id: data.volume.id,
      size: data.volume.size,
      location: data.volume.location.name,
    }
  },

  async attachVolume(volumeId: number, serverId: number): Promise<void> {
    await getClient().post(`/volumes/${volumeId}/actions/attach`, {
      server: serverId,
      automount: true,
    })
  },

  async detachVolume(volumeId: number): Promise<void> {
    await getClient().post(`/volumes/${volumeId}/actions/detach`)
  },

  async deleteVolume(volumeId: number): Promise<void> {
    await getClient().delete(`/volumes/${volumeId}`)
  },

  async getVolume(volumeId: number): Promise<{
    id: number
    size: number
    status: string
    serverId: number | null
  }> {
    const data = await getClient().get<{ volume: HetznerVolume }>(`/volumes/${volumeId}`)
    return {
      id: data.volume.id,
      size: data.volume.size,
      status: data.volume.status,
      serverId: data.volume.server,
    }
  },
}

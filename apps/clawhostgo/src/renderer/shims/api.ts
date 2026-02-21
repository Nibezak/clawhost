const invoke = (channel: string, ...args: unknown[]): Promise<unknown> => {
    return window.electronAPI.invoke(channel, ...args)
}

const api = {
    sendOtp: (_email: string) => Promise.resolve(),
    verifyOtp: (_email: string, _code: string) =>
        Promise.resolve({ customToken: 'local-token' }),

    getPlans: (_provider?: string) =>
        Promise.resolve({
            plans: [{
                id: 'local',
                name: 'Local',
                cpu: 0,
                memory: 0,
                disk: 0,
                priceMonthly: 0,
                architecture: 'local'
            }],
            atCapacity: false
        }),
    getLocations: (_provider?: string) =>
        Promise.resolve([{
            id: 'local',
            name: 'Local',
            city: 'Local',
            country: 'Local',
            disabled: false
        }]),
    getVolumePricing: (_provider?: string) =>
        Promise.resolve({ pricePerGbMonthly: 0, minSize: 0, maxSize: 0 }),
    getPlanAvailability: (_provider?: string) => Promise.resolve([]),

    getClaws: () => invoke('getClaws'),
    getAdminClaws: () => invoke('getClaws'),
    getClaw: (id: string, _sync?: boolean) => invoke('getClaw', id),
    syncClaw: (id: string) => invoke('syncClaw', id),
    createClaw: (data: unknown) => invoke('createClaw', data),
    purchaseClaw: (_data: unknown) =>
        Promise.reject(new Error('Purchasing is not available in local mode.')),
    startClaw: (id: string) => invoke('startClaw', id),
    stopClaw: (id: string) => invoke('stopClaw', id),
    restartClaw: (id: string) => invoke('restartClaw', id),
    deleteClaw: (id: string) => invoke('deleteClaw', id),
    renameClaw: (id: string, data: unknown) => invoke('renameClaw', id, data),
    cancelDeletion: (id: string) => invoke('cancelDeletion', id),
    hardDeleteClaw: (id: string) => invoke('hardDeleteClaw', id),
    getClawDiagnostics: (id: string) => invoke('getClawDiagnostics', id),
    getClawLogs: (id: string) => invoke('getClawLogs', id),
    repairClaw: (id: string) => invoke('repairClaw', id),
    reinstallClaw: (id: string) => invoke('reinstallClaw', id),
    getClawVersion: (id: string) => invoke('getClawVersion', id),
    getClawVersions: (id: string) => invoke('getClawVersions', id),
    installClawVersion: (id: string, version: string) =>
        invoke('installClawVersion', id, version),
    getClawAgents: (id: string) => invoke('getClawAgents', id),
    getClawAgentConfig: (id: string, agentId: string) =>
        invoke('getClawAgentConfig', id, { agentId }),
    updateClawAgentConfig: (id: string, data: unknown) =>
        invoke('updateClawAgentConfig', id, data),
    createClawAgent: (id: string, data: unknown) =>
        invoke('createClawAgent', id, data),
    deleteClawAgent: (id: string, data: unknown) =>
        invoke('deleteClawAgent', id, data),
    getClawChannels: (id: string) => invoke('getClawChannels', id),
    updateClawChannels: (id: string, data: unknown) =>
        invoke('updateClawChannels', id, data),
    pairWhatsApp: (id: string) => invoke('pairWhatsApp', id),
    pairWhatsAppStatus: (id: string) => invoke('pairWhatsAppStatus', id),
    getClawBindings: (id: string) => invoke('getClawBindings', id),
    updateClawBindings: (id: string, data: unknown) =>
        invoke('updateClawBindings', id, data),
    getClawSkills: (id: string) => invoke('getClawSkills', id),
    updateClawSkills: (id: string, data: unknown) =>
        invoke('updateClawSkills', id, data),
    getAgentSkills: (clawId: string, agentId: string) =>
        invoke('getAgentSkills', clawId, agentId),
    updateAgentSkills: (clawId: string, agentId: string, data: unknown) =>
        invoke('updateAgentSkills', clawId, agentId, data),
    browseClawHubSkills: (clawId: string, params: unknown) =>
        invoke('browseClawHubSkills', clawId, params),
    getClawHubInstalled: (clawId: string, agentId?: string) =>
        invoke('getClawHubInstalled', clawId, { agentId }),
    installClawHubSkill: (clawId: string, data: unknown) =>
        invoke('installClawHubSkill', clawId, data),
    removeClawHubSkill: (clawId: string, data: unknown) =>
        invoke('removeClawHubSkill', clawId, data),
    updateClawHubSkill: (clawId: string, data: unknown) =>
        invoke('updateClawHubSkill', clawId, data),
    checkClawHubUpdates: (clawId: string, agentId?: string) =>
        invoke('checkClawHubUpdates', clawId, { agentId }),
    getClawEnvVars: (id: string) => invoke('getClawEnvVars', id),
    updateClawEnvVars: (id: string, data: unknown) =>
        invoke('updateClawEnvVars', id, data),
    exportClaw: async (_id: string, _filename: string) => {},
    listClawFiles: (id: string) => invoke('listClawFiles', id),
    readClawFile: (id: string, filePath: string) =>
        invoke('readClawFile', id, { path: filePath }),
    updateClawFile: (id: string, data: unknown) =>
        invoke('updateClawFile', id, data),

    getSSHKeys: () => Promise.resolve([]),
    createSSHKey: (_data: unknown) => Promise.resolve({}),
    deleteSSHKey: (_id: string) => Promise.resolve(),

    getProfile: () => invoke('getProfile'),
    updateProfile: (_data: unknown) => Promise.resolve({ success: true }),
    connectAuthMethod: (_method: string) => Promise.resolve(),
    disconnectAuthMethod: (_method: string) => Promise.resolve(),
    getUserStats: () => invoke('getUserStats'),
    getBillingHistory: (_page?: number, _limit?: number) =>
        Promise.resolve({ orders: [], total: 0, page: 1, limit: 20 }),
    getOrderInvoice: (_orderId: string) => Promise.resolve({ url: null }),
    getCustomerPortal: () => Promise.resolve({ url: null }),

    getFeatureRequests: (_sort?: string) =>
        Promise.resolve({ featureRequests: [], total: 0 }),
    getFeatureRequestsPublic: (_sort?: string) =>
        Promise.resolve({ featureRequests: [], total: 0 }),
    createFeatureRequest: (_data: unknown) => Promise.resolve({}),
    upvoteFeatureRequest: (_id: string) =>
        Promise.resolve({ upvoteCount: 0, hasUpvoted: false }),
    updateFeatureRequestStatus: (_id: string, _data: unknown) =>
        Promise.resolve(),
    deleteFeatureRequest: (_id: string) => Promise.resolve()
}

export default api
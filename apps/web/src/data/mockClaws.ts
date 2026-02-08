import type { MockClawData } from '@/ts/Interfaces'

export const initialMockClaws: MockClawData[] = [
    {
        id: '1',
        name: 'personal-claw',
        status: 'running',
        subdomain: 'personal-claw',
        ip: '45.33.21.98',
        provider: 'hetzner',
        location: 'Frankfurt, Germany',
        locationFlag: '\u{1F1E9}\u{1F1EA}',
        plan: 'CX22',
        planDetails: '2 vCPU, 4GB RAM, 40GB SSD',
        monthlyCost: '$12/mo',
        serverId: '#48291053',
        createdAt: 'Jan 15, 2026',
        sshKey: 'My MacBook'
    },
    {
        id: '2',
        name: 'experimental',
        status: 'running',
        subdomain: 'experimental',
        ip: '192.241.145.32',
        provider: 'digitalocean',
        location: 'New York 1, USA',
        locationFlag: '\u{1F1FA}\u{1F1F8}',
        plan: 's-1vcpu-1gb',
        planDetails: '1 vCPU, 1GB RAM, 25GB SSD',
        monthlyCost: '$15/mo',
        serverId: '#48291187',
        createdAt: 'Jan 22, 2026',
        sshKey: 'Work Laptop'
    },
    {
        id: '3',
        name: 'research-pro',
        status: 'stopped',
        subdomain: 'research-pro',
        ip: '49.12.234.89',
        provider: 'hetzner',
        location: 'Helsinki, Finland',
        locationFlag: '\u{1F1EB}\u{1F1EE}',
        plan: 'CX21',
        planDetails: '2 vCPU, 4GB RAM, 40GB SSD',
        monthlyCost: '$12/mo',
        serverId: '#48290841',
        createdAt: 'Dec 3, 2025',
        sshKey: 'My MacBook'
    },
    {
        id: '4',
        name: 'company-bot',
        status: 'running',
        subdomain: 'company-bot',
        ip: '95.217.45.123',
        provider: 'digitalocean',
        location: 'Singapore',
        locationFlag: '\u{1F1F8}\u{1F1EC}',
        plan: 's-2vcpu-4gb',
        planDetails: '2 vCPU, 4GB RAM, 80GB SSD',
        monthlyCost: '$50/mo',
        serverId: '#48291302',
        createdAt: 'Feb 1, 2026',
        sshKey: 'Deploy Key'
    }
]
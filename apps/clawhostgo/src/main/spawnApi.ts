import type { SpawnApiResult } from '@/ts/Interfaces'

const spawnApi = (): SpawnApiResult => {
    return {
        port: 0,
        kill: () => {}
    }
}

export default spawnApi
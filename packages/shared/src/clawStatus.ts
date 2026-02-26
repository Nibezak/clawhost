const clawStatus = {
    initializing: 'initializing',
    starting: 'starting',
    running: 'running',
    stopping: 'stopping',
    off: 'off',
    stopped: 'stopped',
    deleting: 'deleting',
    migrating: 'migrating',
    rebuilding: 'rebuilding',
    unreachable: 'unreachable',
    unknown: 'unknown',
    creating: 'creating',
    configuring: 'configuring',
    restarting: 'restarting',
    awaitingPayment: 'awaiting_payment'
} as const

export default clawStatus
const ENV_KEY_REGEX = /^[A-Za-z_][A-Za-z0-9_]*$/

const validateEnvVars = (envVars: Record<string, string>): boolean => {
    for (const key of Object.keys(envVars)) {
        if (!ENV_KEY_REGEX.test(key)) return false
        if (key.length > 256) return false
        if (typeof envVars[key] !== 'string') return false
        if (envVars[key].length > 10000) return false
    }
    return true
}

export default validateEnvVars
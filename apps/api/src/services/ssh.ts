import { Client } from 'ssh2'

const executeSSH = (
    ip: string,
    password: string,
    command: string,
    commandTimeout = 15000
): Promise<string> => {
    return new Promise((resolve, reject) => {
        const conn = new Client()
        let output = ''

        const timeout = setTimeout(() => {
            clearTimeout(timeout)
            conn.end()
            reject(new Error('SSH command timed out'))
        }, commandTimeout)

        const cleanup = () => {
            clearTimeout(timeout)
            conn.end()
        }

        conn.on('ready', () => {
            conn.exec(command, (err, stream) => {
                if (err) {
                    cleanup()
                    return reject(err)
                }

                stream.on('data', (data: Buffer) => {
                    output += data.toString()
                })

                stream.stderr.on('data', (data: Buffer) => {
                    output += data.toString()
                })

                stream.on('close', () => {
                    cleanup()
                    const ansiPattern = new RegExp(
                        String.fromCharCode(27) + '\\[[0-9;]*m',
                        'g'
                    )
                    const cleaned = output
                        .trim()
                        .replace(ansiPattern, '')
                        .replace(/\n{3,}/g, '\n\n')
                    resolve(cleaned)
                })
            })
        })

        conn.on('error', (err) => {
            cleanup()
            reject(err)
        })

        conn.connect({
            host: ip,
            port: 22,
            username: 'root',
            password,
            readyTimeout: 10000,
            algorithms: {
                serverHostKey: ['ssh-ed25519', 'ssh-rsa', 'ecdsa-sha2-nistp256']
            }
        })
    })
}

export default executeSSH
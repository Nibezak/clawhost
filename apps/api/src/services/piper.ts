import type { PiperSynthesisResult } from '@/ts/Interfaces'

import { execFile } from 'child_process'
import { readFileSync } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const PIPER_BINARY = process.env.PIPER_BINARY || 'piper'
const MODELS_DIR = path.resolve(
    process.env.PIPER_MODELS_DIR || path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..', 'ai', 'models')
)

const getModelConfig = (voice: string): { sampleRate: number; channels: number } => {
    const configPath = path.join(MODELS_DIR, `${voice}.onnx.json`)
    const config = JSON.parse(readFileSync(configPath, 'utf-8'))
    return {
        sampleRate: config.audio?.sample_rate || 22050,
        channels: 1
    }
}

const createWavHeader = (pcmLength: number, sampleRate: number, channels: number): Buffer => {
    const bitsPerSample = 16
    const byteRate = sampleRate * channels * (bitsPerSample / 8)
    const blockAlign = channels * (bitsPerSample / 8)
    const header = Buffer.alloc(44)

    header.write('RIFF', 0)
    header.writeUInt32LE(36 + pcmLength, 4)
    header.write('WAVE', 8)
    header.write('fmt ', 12)
    header.writeUInt32LE(16, 16)
    header.writeUInt16LE(1, 20)
    header.writeUInt16LE(channels, 22)
    header.writeUInt32LE(sampleRate, 24)
    header.writeUInt32LE(byteRate, 28)
    header.writeUInt16LE(blockAlign, 32)
    header.writeUInt16LE(bitsPerSample, 34)
    header.write('data', 36)
    header.writeUInt32LE(pcmLength, 40)

    return header
}

const synthesize = (text: string, voice: string): Promise<PiperSynthesisResult> => {
    const modelPath = path.join(MODELS_DIR, `${voice}.onnx`)
    const { sampleRate, channels } = getModelConfig(voice)

    return new Promise((resolve, reject) => {
        const child = execFile(
            PIPER_BINARY,
            ['--model', modelPath, '--output-raw'],
            { maxBuffer: 50 * 1024 * 1024, encoding: 'buffer' },
            (error, stdout) => {
                if (error) {
                    reject(error)
                    return
                }

                const pcm = stdout as unknown as Buffer
                const header = createWavHeader(pcm.length, sampleRate, channels)
                const audio = Buffer.concat([header, pcm])

                resolve({ audio, sampleRate, channels })
            }
        )

        if (child.stdin) {
            child.stdin.write(text)
            child.stdin.end()
        }
    })
}

export default synthesize
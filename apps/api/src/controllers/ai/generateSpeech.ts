import type { AuthenticatedContext } from '@/ts/Types'
import type { GenerateSpeechBody } from '@/ts/Interfaces'

import { existsSync } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import synthesize from '@/services/piper'
import { fail } from '@/lib/response'
import { t } from '@openclaw/i18n'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DEFAULT_VOICE = 'en_US-ryan-high'
const MODELS_DIR = path.resolve(
    process.env.PIPER_MODELS_DIR ||
        path.join(__dirname, '..', '..', '..', 'ai', 'models')
)

const generateSpeech = async (c: AuthenticatedContext) => {
    try {
        const body = await c.req.json<GenerateSpeechBody>()

        if (!body.text || !body.text.trim()) {
            return fail(c, t('api.textRequired'), 400)
        }

        const voice = body.voice || DEFAULT_VOICE
        const modelPath = path.join(MODELS_DIR, `${voice}.onnx`)

        if (!existsSync(modelPath)) {
            return fail(c, t('api.voiceNotFound'), 400)
        }

        const result = await synthesize(body.text.trim(), voice)

        return new Response(new Uint8Array(result.audio), {
            headers: {
                'Content-Type': 'audio/wav',
                'Content-Disposition': 'inline; filename="speech.wav"'
            }
        })
    } catch (err) {
        console.error('TTS generation failed:', err)
        return fail(c, t('api.ttsGenerationFailed'), 500)
    }
}

export default generateSpeech
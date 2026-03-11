import type { TranscriberFunction } from '@/ts/Types'

import { pipeline } from '@huggingface/transformers'

const WHISPER_MODEL = 'onnx-community/whisper-small'

let transcriberPromise: Promise<TranscriberFunction> | null = null

const getTranscriber = () => {
    if (!transcriberPromise) {
        transcriberPromise = pipeline(
            'automatic-speech-recognition',
            WHISPER_MODEL,
            {
                dtype: 'q8',
                device: 'wasm'
            }
        ) as unknown as Promise<TranscriberFunction>
    }
    return transcriberPromise
}

export default getTranscriber
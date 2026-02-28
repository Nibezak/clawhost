import { pipeline } from '@huggingface/transformers'

const WHISPER_MODEL = 'onnx-community/whisper-small'

// @ts-ignore
let transcriberPromise: ReturnType<typeof pipeline> | null = null

const getTranscriber = () => {
    if (!transcriberPromise) {
        transcriberPromise = pipeline(
            'automatic-speech-recognition',
            WHISPER_MODEL,
            {
                dtype: 'q8',
                device: 'wasm'
            }
        )
    }
    return transcriberPromise
}

export default getTranscriber
import os
import io
import torch
import soundfile as sf
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException
from fastapi.responses import Response, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from dotenv import load_dotenv
from qwen_tts import Qwen3TTSModel

load_dotenv()

MODEL_NAME = os.getenv("MODEL_NAME", "Qwen/Qwen3-TTS-12Hz-0.6B-CustomVoice")
PORT = int(os.getenv("PORT", "3333"))
DEVICE_SETTING = os.getenv("DEVICE", "auto")

model = None


def get_device():
    if DEVICE_SETTING != "auto":
        return DEVICE_SETTING
    if torch.cuda.is_available():
        return "cuda:0"
    if hasattr(torch.backends, "mps") and torch.backends.mps.is_available():
        return "mps"
    return "cpu"


@asynccontextmanager
async def lifespan(app: FastAPI):
    global model
    device = get_device()
    dtype = torch.float32 if device == "cpu" else torch.bfloat16

    print(f"Loading {MODEL_NAME} on {device} ({dtype})")
    model = Qwen3TTSModel.from_pretrained(
        MODEL_NAME,
        device_map=device,
        dtype=dtype,
    )
    print("Model loaded")
    yield
    model = None


app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type"],
)

VOICES = [
    {"id": "Chelsie", "name": "Chelsie"},
    {"id": "Kore", "name": "Kore"},
    {"id": "Aura", "name": "Aura"},
    {"id": "Sage", "name": "Sage"},
    {"id": "Aria", "name": "Aria"},
    {"id": "Sarah", "name": "Sarah"},
    {"id": "Vivian", "name": "Vivian"},
    {"id": "Ryan", "name": "Ryan"},
    {"id": "Serena", "name": "Serena"},
    {"id": "Dylan", "name": "Dylan"},
    {"id": "Eric", "name": "Eric"},
    {"id": "Aiden", "name": "Aiden"},
    {"id": "Olivia", "name": "Olivia"},
    {"id": "Harper", "name": "Harper"},
    {"id": "Luna", "name": "Luna"},
]

MODELS = [
    {"id": "Qwen/Qwen3-TTS-12Hz-0.6B-CustomVoice", "name": "0.6B CustomVoice", "description": "Lightweight, 9 preset voices"},
    {"id": "Qwen/Qwen3-TTS-12Hz-0.6B-Base", "name": "0.6B Base", "description": "Lightweight, voice cloning"},
    {"id": "Qwen/Qwen3-TTS-12Hz-1.7B-CustomVoice", "name": "1.7B CustomVoice", "description": "Full quality, 9 preset voices"},
    {"id": "Qwen/Qwen3-TTS-12Hz-1.7B-VoiceDesign", "name": "1.7B VoiceDesign", "description": "Full quality, design voice via text"},
    {"id": "Qwen/Qwen3-TTS-12Hz-1.7B-Base", "name": "1.7B Base", "description": "Full quality, voice cloning"},
]

FORMATS = [
    {"id": "wav", "name": "WAV", "contentType": "audio/wav"},
    {"id": "flac", "name": "FLAC", "contentType": "audio/flac"},
    {"id": "mp3", "name": "MP3", "contentType": "audio/mpeg", "note": "requires ffmpeg"},
]

CONTENT_TYPES = {
    "wav": "audio/wav",
    "flac": "audio/flac",
    "mp3": "audio/mpeg",
}


class TTSRequest(BaseModel):
    text: str
    voice: Optional[str] = "Chelsie"
    language: Optional[str] = "English"
    instruct: Optional[str] = None
    format: Optional[str] = "wav"


def make_response(data=None, message="", success=True, code=200):
    return JSONResponse(
        status_code=code,
        content={
            "success": success,
            "data": data,
            "message": message,
            "code": code,
        },
    )


@app.get("/health")
async def health():
    return make_response(
        data={"model": MODEL_NAME, "device": get_device()},
        message="OK",
    )


@app.get("/voices")
async def voices():
    return make_response(data={"voices": VOICES}, message="Voices fetched")


@app.get("/models")
async def models():
    return make_response(data={"models": MODELS}, message="Models fetched")


@app.get("/formats")
async def formats():
    return make_response(data={"formats": FORMATS}, message="Formats fetched")


@app.post("/tts")
async def tts(req: TTSRequest):
    if not req.text or not req.text.strip():
        raise HTTPException(status_code=400, detail="Text is required")

    if model is None:
        raise HTTPException(status_code=503, detail="Model not loaded")

    try:
        speaker = req.voice or "Chelsie"
        language = req.language or "English"
        fmt = req.format or "wav"

        wavs, sr = model.generate_custom_voice(
            text=req.text,
            language=language,
            speaker=speaker,
            instruct=req.instruct or "",
        )

        audio_data = wavs[0].cpu().numpy()
        buffer = io.BytesIO()

        if fmt == "mp3":
            sf.write(buffer, audio_data, sr, format="wav")
            buffer.seek(0)
            try:
                from pydub import AudioSegment

                audio_seg = AudioSegment.from_wav(buffer)
                mp3_buffer = io.BytesIO()
                audio_seg.export(mp3_buffer, format="mp3")
                mp3_buffer.seek(0)
                buffer = mp3_buffer
            except Exception:
                raise HTTPException(
                    status_code=500,
                    detail="MP3 conversion failed, install ffmpeg or use wav format",
                )
        else:
            sf.write(buffer, audio_data, sr, format=fmt)
            buffer.seek(0)

        content_type = CONTENT_TYPES.get(fmt, "audio/wav")

        return Response(
            content=buffer.read(),
            media_type=content_type,
            headers={"Content-Disposition": f'inline; filename="speech.{fmt}"'},
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=PORT)
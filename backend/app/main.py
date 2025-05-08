from fastapi import FastAPI, WebSocket, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from vosk import Model, KaldiRecognizer
import json
import wave
import numpy as np
import sounddevice as sd
import asyncio
import os
from typing import List, Optional
from pydantic import BaseModel

app = FastAPI(title="Sunbird ALL ASR API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Vosk model
MODEL_PATH = os.getenv("VOSK_MODEL_PATH", "models/vosk-model-small-en-us-0.15")
model = Model(MODEL_PATH)

class ASRResponse(BaseModel):
    text: str
    confidence: float
    language: str

@app.get("/")
async def root():
    return {"message": "Sunbird ALL ASR API"}

@app.post("/asr/recognize", response_model=ASRResponse)
async def recognize_speech(audio_file: UploadFile = File(...)):
    """
    Process an audio file and return the recognized text
    """
    # Save the uploaded file temporarily
    temp_path = f"temp_{audio_file.filename}"
    with open(temp_path, "wb") as buffer:
        content = await audio_file.read()
        buffer.write(content)
    
    try:
        # Process the audio file
        wf = wave.open(temp_path, "rb")
        rec = KaldiRecognizer(model, wf.getframerate())
        rec.SetWords(True)

        # Read audio data
        while True:
            data = wf.readframes(4000)
            if len(data) == 0:
                break
            if rec.AcceptWaveform(data):
                result = json.loads(rec.Result())
                if result.get("text"):
                    return ASRResponse(
                        text=result["text"],
                        confidence=result.get("confidence", 0.0),
                        language="en-US"
                    )
        
        # Get final result
        result = json.loads(rec.FinalResult())
        return ASRResponse(
            text=result.get("text", ""),
            confidence=result.get("confidence", 0.0),
            language="en-US"
        )
    
    finally:
        # Clean up temporary file
        if os.path.exists(temp_path):
            os.remove(temp_path)

@app.websocket("/ws/asr")
async def websocket_endpoint(websocket: WebSocket):
    """
    WebSocket endpoint for real-time speech recognition
    """
    await websocket.accept()
    
    try:
        while True:
            # Receive audio data
            audio_data = await websocket.receive_bytes()
            
            # Convert bytes to numpy array
            audio_array = np.frombuffer(audio_data, dtype=np.int16)
            
            # Process with Vosk
            rec = KaldiRecognizer(model, 16000)
            if rec.AcceptWaveform(audio_array.tobytes()):
                result = json.loads(rec.Result())
                await websocket.send_json({
                    "text": result.get("text", ""),
                    "confidence": result.get("confidence", 0.0),
                    "language": "en-US"
                })
    
    except Exception as e:
        print(f"WebSocket error: {str(e)}")
    finally:
        await websocket.close()

@app.get("/languages")
async def get_supported_languages():
    """
    Return list of supported languages
    """
    return {
        "languages": [
            {"code": "en-US", "name": "English (US)"},
            {"code": "hi-IN", "name": "Hindi"},
            {"code": "es-ES", "name": "Spanish"},
            # Add more languages as models become available
        ]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 
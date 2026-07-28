from fastapi import FastAPI
# from fastapi import UploadFile, File
# from pypdf import PdfReader
from fastapi.middleware.cors import CORSMiddleware
import io

from dotenv import load_dotenv

# from pydantic import BaseModel

# class JobDescriptionRequest(BaseModel):
#     jobDescription: str

load_dotenv()

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    # allow_origins=["http://localhost:3000", "http://localhost:8080", "https://id-preview--fd4e325a-faac-4445-9c1c-66f0102e545f.lovable.app"],
    # # allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

from app.api.resume import router as resume_router
from app.api.interview import router as interview_router
from app.api.session import router as session_router

app.include_router(resume_router)
app.include_router(interview_router)
app.include_router(session_router)

@app.get("/")
def home():
    return {
        "message": "AI Interview Coach Backend Running"
    }
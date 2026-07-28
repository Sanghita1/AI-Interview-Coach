from fastapi import APIRouter, UploadFile, File, FastAPI
from pypdf import PdfReader
import io

from fastapi.middleware.cors import CORSMiddleware
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    # allow_origins=["http://localhost:3000", "http://localhost:8080", "https://id-preview--fd4e325a-faac-4445-9c1c-66f0102e545f.lovable.app"],
    # allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)

# from app.storage.resume_store import (
#     save_resume
# )
# from app.session.interview_session import interview_session
from app.session.session_manager import session_manager
from fastapi import HTTPException
router = APIRouter()


@router.post("/resume/upload")
async def upload_resume(session_id: str, file: UploadFile = File(...)):
    session = session_manager.get_session(session_id)

    if session is None:
        raise HTTPException(
            status_code=404,
            detail="Invalid session."
        )
    content = await file.read()

    pdf_reader = PdfReader(io.BytesIO(content))

    text = ""

    for page in pdf_reader.pages:
        page_text = page.extract_text()

        if page_text:
            text += page_text

    # save_resume(text)
    # interview_session.resume = text
    session.resume = text

    return {
        "filename": file.filename,
        "characters": len(text),
        "preview": text[:500]
    }
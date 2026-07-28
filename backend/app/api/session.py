from fastapi import APIRouter

from app.session.session_manager import session_manager
from fastapi import HTTPException

router = APIRouter()


@router.post("/session")
async def create_session():

    session_id = session_manager.create_session()

    return {
        "session_id": session_id
    }

@router.get("/session/{session_id}")
async def get_session_state(session_id: str):

    session = session_manager.get_session(session_id)

    if session is None:
        raise HTTPException(
            status_code=404,
            detail="Invalid session."
        )

    return {
        "current_question": session.current_question,
        "question_number": session.question_number,
        "completed": session.completed,
        "progress": {
            "current": session.question_number,
            "total": (
                session.interview_plan.total_questions
                if session.interview_plan
                else 0
            )
        }
    }
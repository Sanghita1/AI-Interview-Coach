from fastapi import APIRouter

from app.models.request_models import JobDescriptionRequest, CandidateAnswerRequest
from app.services.gemini_service import gemini_service
# from app.session.interview_session import interview_session
from app.graph.workflow import interview_graph
from fastapi import HTTPException
from app.graph.interview_round_graph import interview_round_graph
from app.utils.report_utils import build_interview_transcript
from app.session.session_manager import session_manager



router = APIRouter()


@router.post("/job-description")
async def upload_job_description(
    request: JobDescriptionRequest, session_id: str,
):
    session = session_manager.get_session(session_id)
    if session is None:
        raise HTTPException(
            status_code=404,
            detail="Invalid session."
        )
    session.job_description = request.jobDescription

    return {
        "message": "Job Description Saved Successfully",
        "characters": len(request.jobDescription),
        "preview": request.jobDescription[:500],
    }


@router.post("/interview/start")
async def start_interview(session_id: str):
    session = session_manager.get_session(session_id)

    if session is None:
        raise HTTPException(
            status_code=404,
            detail="Invalid session."
        )
    session.reset()
    state = {
        "resume": session.resume,
        "job_description": session.job_description,
        "interview_plan": None,
        "current_question": None,
        "candidate_answer": None,
        "last_evaluation": None,
        "questions": [],
        "answers": [],
        "feedback": [],
        "scores": [],
        "question_number": 0,
        "is_followup": False,
        "completed": False,
    }

    result = interview_graph.invoke(state)

    plan = result["interview_plan"]

    session.interview_plan = plan
    session.current_question = result["current_question"]
    session.questions.append(result["current_question"])

    session.question_number = result["question_number"]
    session.completed = result["completed"]

    return {
        "plan": result["interview_plan"],
        "question": result["current_question"],
        "progress": {
            "current": result["question_number"],
            "total": result["interview_plan"].total_questions
        }
    }

    # return plan

@router.post("/interview/answer")
async def submit_answer(request: CandidateAnswerRequest, session_id: str):
    session = session_manager.get_session(session_id)
    if session is None:
        raise HTTPException(
            status_code=404,
            detail="Invalid session."
        )
    if session.current_question is None:
        raise HTTPException(
            status_code=400,
            detail="Interview has not been started."
        )
    # evaluation = gemini_service.evaluate_answer(
    #     question=interview_session.current_question,
    #     answer=request.answer,
    # )
    state = {

    "resume": session.resume,

    "job_description": session.job_description,

    "interview_plan": session.interview_plan,

    "current_question": session.current_question,

    "candidate_answer": request.answer,

    "last_evaluation": None,
    "questions": session.questions,

    "answers": session.answers,

    "feedback": session.feedback,

    "scores": session.scores,

    "question_number": session.question_number,

    "completed": session.completed,

    }

    result = interview_round_graph.invoke(state)
    session.answers = result["answers"]

    session.feedback = result["feedback"]

    session.scores = result["scores"]

    session.current_question = result["current_question"]
    session.questions.append(result["current_question"])

    session.question_number = result["question_number"]

    session.last_evaluation = result["last_evaluation"]
    session.completed = result["completed"]
    if result["completed"]:
        return {

            "completed": True,

            "evaluation": result["last_evaluation"]

        }
    return{
    
        "question": result["current_question"],

        "progress": {

            "current": result["question_number"],

            "total": result["interview_plan"].total_questions

        },

        "evaluation": result["last_evaluation"]
    }

@router.post("/interview/report")
async def generate_final_report(session_id: str):
    session = session_manager.get_session(session_id)
    if session is None:
        raise HTTPException(
            status_code=404,
            detail="Invalid session."
        )
    transcript = build_interview_transcript(
    session.questions,
    session.answers,
    session.feedback,
    )

    report = gemini_service.generate_final_report(
        resume=session.resume,
        job_description=session.job_description,
        interview_plan=session.interview_plan,
        transcript=transcript,
    )

    return report





    

    
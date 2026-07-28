import uuid
from typing import Dict

from app.graph.state import InterviewState


class SessionManager:

    def __init__(self):
        self.sessions: Dict[str, InterviewState] = {}

    def create_session(self):

        session_id = str(uuid.uuid4())

        state: InterviewState = {
            "resume": "",
            "job_description": "",
            "interview_plan": None,
            "current_question": None,
            "answers": [],
            "feedback": [],
            "scores": [],
            "question_number": 0,
            "completed": False
        }

        self.sessions[session_id] = state

        return session_id

    def get_state(self, session_id):

        return self.sessions.get(session_id)

    def save_state(self, session_id, state):

        self.sessions[session_id] = state


session_manager = SessionManager()
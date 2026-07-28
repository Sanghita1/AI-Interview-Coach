from pydantic import BaseModel
from typing import List


class InterviewEvaluation(BaseModel):

    score: int

    feedback: str

    strengths: List[str]

    improvements: List[str]

    follow_up_required: bool
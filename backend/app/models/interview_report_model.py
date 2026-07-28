from typing import Literal
from pydantic import BaseModel


class FinalInterviewReport(BaseModel):

    interview_summary: str

    overall_score: int

    strengths: list[str]

    weaknesses: list[str]

    recommendation: Literal[
        "Strong Hire",
        "Hire",
        "Borderline",
        "No Hire"
    ]

    reasoning: str
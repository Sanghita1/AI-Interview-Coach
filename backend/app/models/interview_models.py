from pydantic import BaseModel
from typing import List


class InterviewSection(BaseModel):
    name: str
    question_count: int
    purpose: str


class InterviewPlan(BaseModel):
    difficulty: str
    estimated_duration: str
    total_questions: int
    sections: List[InterviewSection]
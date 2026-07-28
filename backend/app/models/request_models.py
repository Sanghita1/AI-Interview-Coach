from pydantic import BaseModel


class JobDescriptionRequest(BaseModel):
    jobDescription: str


class InterviewAnswerRequest(BaseModel):
    answer: str

class CandidateAnswerRequest(BaseModel):
    answer: str
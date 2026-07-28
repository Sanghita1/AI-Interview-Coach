from pydantic import BaseModel


class InterviewQuestion(BaseModel):

    id: int

    section: str

    difficulty: str

    question: str

    expected_topics: list[str]

    is_followup: bool = False

    max_score: int = 10
from typing import TypedDict, List, Optional

from app.models.interview_models import (
    InterviewPlan
)

from app.models.question_models import (
    InterviewQuestion
)

from app.models.evaluation_models import (
    InterviewEvaluation
)


class InterviewState(TypedDict):

    resume: str

    job_description: str

    interview_plan: InterviewPlan | None

    current_question: InterviewQuestion | None

    candidate_answer: str | None

    last_evaluation: InterviewEvaluation | None

    answers: list[str]

    feedback: list[str]

    scores: list[int]

    question_number: int

    is_followup: bool

    completed: bool
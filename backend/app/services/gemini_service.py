import os

from dotenv import load_dotenv
from google import genai
from google.genai import types

from app.models.interview_models import InterviewPlan
from app.models.interview_report_model import FinalInterviewReport
from app.prompts.interview_prompts import INTERVIEW_PLAN_PROMPT
from app.prompts.interview_prompts import FINAL_REPORT_PROMPT

from app.models.question_models import (
    InterviewQuestion
)

from app.prompts.interview_prompts import (
    QUESTION_PROMPT
)

from app.models.evaluation_models import InterviewEvaluation
from app.prompts.interview_prompts import EVALUATION_PROMPT

load_dotenv()


class GeminiService:

    def __init__(self):

        self.client = genai.Client(
            api_key=os.getenv("GEMINI_API_KEY")
        )

        self.model = "gemini-2.5-flash"

    def generate_interview_plan(
        self,
        resume: str,
        job_description: str
    ) -> InterviewPlan:

        prompt = f"""
{INTERVIEW_PLAN_PROMPT}

Candidate Resume:

{resume}

Job Description:

{job_description}
"""

        response = self.client.models.generate_content(
            model=self.model,
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                response_schema=InterviewPlan,
                temperature=0.3,
            ),
        )

        return response.parsed

    def generate_question(

    self,

    resume,

    job_description,

    interview_plan,

    question_number

    ):

        prompt = f"""
    {QUESTION_PROMPT}

    Interview Plan
    {interview_plan.model_dump_json(indent=2)}

    Resume
    {resume}

    Job Description
    {job_description}

    Question Number
    {question_number}

    # Total Questions
    # {interview_plan.total_questions}
    """

        response = self.client.models.generate_content(

            model=self.model,

            contents=prompt,

            config=types.GenerateContentConfig(

                response_mime_type="application/json",

                response_schema=InterviewQuestion,

                temperature=0.3

            )

        )

        return response.parsed

    def evaluate_answer(self,question,answer):

        prompt = f"""
    {EVALUATION_PROMPT}

    Interview Question

    {question.question}

    Expected Topics

    {question.expected_topics}

    Maximum Score

    {question.max_score}

    Candidate Answer

    {answer}
    """

        response = self.client.models.generate_content(
            model=self.model,
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                response_schema=InterviewEvaluation,
                temperature=0.2
            ),
        )

        return response.parsed

    def generate_followup_question(
    self,
    question,
    candidate_answer,
    evaluation,
    ):
        prompt = f"""
    Previous Question
    {question.question}

    Candidate Answer
    {candidate_answer}

    Evaluation
    {evaluation.model_dump_json(indent=2)}
        """

        response = self.client.models.generate_content(

            model=self.model,

            contents=prompt,

            config=types.GenerateContentConfig(

                response_mime_type="application/json",

                response_schema=InterviewQuestion,

                temperature=0.3
            )
        )

        return response.parsed

    def generate_final_report(self,resume,job_description,interview_plan,transcript):
        prompt = f"""
    {FINAL_REPORT_PROMPT}

Resume

{resume}

Job Description

{job_description}

Interview Plan

{interview_plan.model_dump_json(indent=2)}

Interview Transcript

{transcript}
    """
        response = self.client.models.generate_content(
        model=self.model,
        contents=prompt,
        config=types.GenerateContentConfig(
            response_mime_type="application/json",
            response_schema=FinalInterviewReport,
            temperature=0.3
        )
        )

        return response.parsed

        

    

   
gemini_service = GeminiService()
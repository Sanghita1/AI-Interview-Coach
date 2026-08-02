import os

from dotenv import load_dotenv
# from google import genai
# from google.genai import types
from openai import OpenAI
import json

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

        # self.client = genai.Client(
        #     api_key=os.getenv("GEMINI_API_KEY")
        # )

        # self.model = "gemini-2.5-flash"
        self.client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        self.model = "gpt-4o-mini"
        self.model2 = "gpt-4.1-mini"

    def generate_interview_plan(
        self,
        resume: str,
        job_description: str
    ) -> InterviewPlan:

        prompt = f"""
{INTERVIEW_PLAN_PROMPT}

Candidate Resume:

{resume}

Job Description Summary:

{job_description}
"""

        response = self.client.beta.chat.completions.parse(
        model=self.model,
        messages=[
            {
                "role": "user",
                "content": prompt,
            }
        ],
        response_format=InterviewPlan,
        temperature=0.3,
        )

        return response.choices[0].message.parsed
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

    Job Description Summary
    {job_description}

    Question Number
    {question_number}

    # Total Questions
    # {interview_plan.total_questions}
    """

        response = self.client.beta.chat.completions.parse(
        model=self.model2,
        messages=[
            {
                "role": "user",
                "content": prompt,
            }
        ],
        response_format=InterviewQuestion,
        temperature=0.3,
        )

        return response.choices[0].message.parsed

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

        response = self.client.beta.chat.completions.parse(
        model=self.model2,
        messages=[
            {
                "role": "user",
                "content": prompt,
            }
        ],
        response_format=InterviewEvaluation,
        temperature=0.2,
        )

        return response.choices[0].message.parsed

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

        response = self.client.beta.chat.completions.parse(
        model=self.model2,
        messages=[
            {
                "role": "user",
                "content": prompt,
            }
        ],
        response_format=InterviewQuestion,
        temperature=0.3,
        )

        return response.choices[0].message.parsed

    def generate_final_report(self,resume,job_description,transcript):
        prompt = f"""
    {FINAL_REPORT_PROMPT}

Resume

{resume}

Job Description Summary

{job_description}


Interview Transcript

{transcript}
    """
        response = self.client.beta.chat.completions.parse(
        model=self.model,
        messages=[
            {
                "role": "user",
                "content": prompt,
            }
        ],
        response_format=FinalInterviewReport,
        temperature=0.3,
        )

        return response.choices[0].message.parsed

    def generate_job_profile(self, job_description):
        prompt = f"""
    You are an expert technical recruiter.

    Summarize the following job description into a concise technical profile for an AI interviewer.

    Include:
    - Role
    - Required Skills
    - Preferred Skills
    - Key Responsibilities
    - Experience Level

    Keep it under 200 words.

    Job Description:

    {job_description}
    """

        response = self.client.chat.completions.create(
            model=self.model,
            messages=[
                {
                    "role": "user",
                    "content": prompt,
                }
            ],
            temperature=0.2,
        )

        return response.choices[0].message.content.strip()
        

    

   
gemini_service = GeminiService()
from app.graph.state import InterviewState

# from app.services.gemini_service import (
#     generate_interview_plan
# )

from app.services.gemini_service import gemini_service

def generate_plan_node(
    state: InterviewState
):

    plan = gemini_service.generate_interview_plan(

        state["resume"],

        state["job_description"]

    )

    state["interview_plan"] = plan

    return state

def generate_question_node(

    state

):

    question = gemini_service.generate_question(

        resume=state["resume"],

        job_description=state["job_description"],

        interview_plan=state["interview_plan"],

        question_number=state["question_number"] + 1,

    )

    state["current_question"] = question

    state["question_number"] += 1

    return state

def evaluate_answer_node(state):

    evaluation = gemini_service.evaluate_answer(

        question=state["current_question"],

        answer=state["candidate_answer"]

    )

    state["answers"].append(state["candidate_answer"])

    state["feedback"].append(evaluation.feedback)

    state["scores"].append(evaluation.score)

    state["last_evaluation"] = evaluation

    return state

# def followup_required_node(state):

#     return state

def decide_next_step(state):

    # First priority:
    # Is the interview already finished?

    if (state["question_number"]>= state["interview_plan"].total_questions):
        return "complete"

    evaluation = state["last_evaluation"]

    if (evaluation.follow_up_required and not state["current_question"].is_followup):
        if(evaluation.score >(state["current_question"].max_score/2) and evaluation.score < (state["current_question"].max_score-1)):
            return "followup"

    return "next_question"

def generate_followup_node(state):

    question = gemini_service.generate_followup_question(

        question=state["current_question"],

        candidate_answer=state["candidate_answer"],

        evaluation=state["last_evaluation"]

    )

    question.is_followup = True

    state["current_question"] = question

    return state

def complete_interview_node(state):

    state["completed"] = True

    return state


    
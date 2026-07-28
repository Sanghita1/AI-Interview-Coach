def build_interview_transcript(
    questions,
    answers,
    feedback,
):
    transcript = ""

    for i in range(len(answers)):

        transcript += f"""
Question {i+1}

{questions[i].question}

Answer

{answers[i]}

Evaluation

{feedback[i]}

----------------------------------------

"""

    return transcript
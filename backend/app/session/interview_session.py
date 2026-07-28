class InterviewSession:

    def __init__(self):
        self.resume = ""
        self.job_description = ""
        self.reset()

    def reset(self):
        # self.resume = ""
        # self.job_description = ""

        self.interview_plan = None

        self.current_question = None

        self.question_number = 0

        self.questions = []

        self.answers = []

        self.feedback = []

        self.scores = []

        self.followup_count = 0

        self.is_followup: bool = False

        self.completed = False

# interview_session = InterviewSession()
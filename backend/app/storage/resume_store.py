resume_text = ""
def save_resume(text):
    global resume_text
    resume_text = text

def get_resume():
    return resume_text
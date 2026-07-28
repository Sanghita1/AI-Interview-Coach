job_text = ""
def save_job_description(text):
    global job_text
    job_text = text

def get_job_description():
    return job_text
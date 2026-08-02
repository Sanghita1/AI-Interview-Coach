# AI Interview Coach Backend

This folder contains the Python FastAPI backend for the AI Interview Coach application. It powers the interview session lifecycle, resume ingestion, job description analysis, AI-generated interview questions, answer evaluation, and final performance reporting.

## Overview

The backend is designed around a session-based interview workflow:

1. Create a new session.
2. Upload a candidate resume as a PDF.
3. Submit a job description.
4. Start the interview.
5. Submit answers question by question.
6. Generate a final interview report.

The service uses FastAPI, Pydantic models, and a LangGraph-driven interview workflow backed by OpenAI-compatible LLM calls.

## Tech Stack

- Python 3.11+
- FastAPI
- Uvicorn
- Pydantic
- LangGraph
- OpenAI Python client
- PyPDF for PDF text extraction
- Docker support for containerized deployment

## Project Structure

- `app/main.py` - FastAPI application entrypoint and router registration
- `app/api/` - REST API endpoints for resume, interview, and session operations
- `app/graph/` - LangGraph interview workflow and graph state handling
- `app/services/` - AI service integration layer
- `app/models/` - request/response and interview-report schema models
- `app/session/` - in-memory session management
- `app/utils/` - transcript/report formatting utilities
- `requirements.txt` - backend dependencies
- `Dockerfile` - container build configuration

## Prerequisites

- Python 3.11+
- A virtual environment (recommended)
- An `OPENAI_API_KEY` value in your environment

## Environment Variables

Create a `.env` file in the backend directory with:

```bash
OPENAI_API_KEY=your_openai_api_key_here
```

The application also loads environment variables automatically using `python-dotenv`.

## Installation

From the backend folder:

```bash
pip install -r requirements.txt
```

## Running the Backend

Start the API in development mode:

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The service will be available at:

```text
http://localhost:8000
```

## Docker

Build the container:

```bash
docker build -t ai-interview-coach-backend .
```

Run the container:

```bash
docker run -p 8000:8000 --env-file .env ai-interview-coach-backend
```

## API Endpoints

### Session

- `POST /session` - Create a new interview session
- `GET /session/{session_id}` - Retrieve current session progress

### Resume

- `POST /resume/upload?session_id=<session_id>` - Upload a resume PDF and store extracted text in the session

### Job Description

- `POST /job-description?session_id=<session_id>`
  - Body:

```json
{
  "jobDescription": "Your target job description"
}
```

### Interview Flow

- `POST /interview/start?session_id=<session_id>` - Start the interview and return the first question
- `POST /interview/answer?session_id=<session_id>`
  - Body:

```json
{
  "answer": "Candidate response text"
}
```

- `POST /interview/report?session_id=<session_id>` - Generate the final interview evaluation report

## Notes

- Session storage is currently in-memory and will be reset when the backend process restarts.
- The resume upload route expects a PDF file and extracts readable text using `PyPDF`.
- The interview flow is AI-driven, with generated questions, evaluation feedback, and a final summary report produced from the candidate transcript.

## Health Check

A lightweight root endpoint is exposed:

- `GET /` - Returns a simple startup confirmation message

## License

This backend is intended for interview-preparation and educational use.

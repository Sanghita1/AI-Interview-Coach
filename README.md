# AI Interview Coach

AI Interview Coach is a full-stack interview preparation application that helps candidates practice for technical and role-specific interviews using their resume, a target job description, and AI-generated interview sessions.

The application combines:

- a React + TypeScript frontend for guided user flows
- a FastAPI backend for session management and interview orchestration
- an OpenAI-backed AI pipeline for plan generation, question generation, answer evaluation, and final reporting

## What the App Does

Users can:

1. Create a new interview session
2. Upload a resume PDF
3. Submit a job description
4. Start a personalized mock interview
5. Answer interview questions step by step
6. Receive AI-powered evaluation and a final report

## High-Level Architecture

```text
Frontend (React/Vite)
    ↓
Backend API (FastAPI)
    ↓
Interview Workflow (LangGraph + AI services)
    ↓
Session state + report generation
```

## Tech Stack

### Frontend

- React 19
- TypeScript
- Vite
- TanStack Router
- Tailwind CSS
- shadcn/ui component system

### Backend

- Python 3.11+
- FastAPI
- Uvicorn
- Pydantic
- LangGraph
- OpenAI Python SDK
- PyPDF for PDF content extraction

## Repository Structure

```text
ai-interview-coach/
├── backend/               # FastAPI service and interview engine
│   ├── app/
│   ├── Dockerfile
│   └── requirements.txt
└── frontend/              # React/Vite client application
    ├── src/
    └── package.json
```

## Prerequisites

Before running the app locally, make sure you have:

- Node.js 18+
- npm
- Python 3.11+
- A valid `OPENAI_API_KEY`

## Environment Setup

### Backend

Create a `.env` file inside the backend folder:

```bash
OPENAI_API_KEY=your_openai_api_key_here
```

The backend uses `python-dotenv` to load environment variables automatically.



## Running the Project

### Local development

- Frontend URL: `http://localhost:8080`
- Backend URL: `http://localhost:8000`

### Hosted demo

- Frontend: `https://ai-interview-coach-green-seven.vercel.app/`
- Backend: `https://ai-interview-coach-y7m9.onrender.com`

## Core User Flow

The application is organized around a session-based dynamic interview process:

1. `POST /session` creates a session
2. `POST /resume/upload` stores the candidate resume text
3. `POST /job-description` stores the target role summary
4. `POST /interview/start` initiates the interview graph
5. `POST /interview/answer` advances the interview one question at a time
6. `POST /interview/report` returns the final report

## Docker Support

A Docker image is available for the backend service.

Build:

```bash
docker build -t ai-interview-coach-backend ./backend
```

Run:

```bash
docker run -p 8000:8000 --env-file ./backend/.env ai-interview-coach-backend
```

## Notes

- The backend currently keeps session state in memory, so restarting the service will clear sessions.
- Resume uploads are expected to be PDF files and are parsed using `PyPDF`.
- The interview workflow is AI-driven and returns structured evaluation output for each question and the final report.

## License

This project is intended for interview preparation and educational use.

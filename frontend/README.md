# Interview Ace

Interview Ace is a modern AI-powered interview practice app that helps candidates prepare for job interviews by combining a resume upload, a target job description, and a personalized mock interview experience.

The app guides users through a complete flow:
- upload a resume
- provide a job description
- answer tailored interview questions
- receive feedback and a final performance report

## Features

- Personalized mock interviews based on your resume and target role
- Guided multi-step interview experience
- Resume upload workflow
- Job description submission
- AI-style evaluation and reporting
- Clean, responsive UI built with modern React components

## Tech Stack

- React 19 with TypeScript
- Vite for fast development and builds
- TanStack Router for routing
- React Query for data fetching
- Tailwind CSS and shadcn/ui components
- Lucide icons and Sonner toast notifications

## Project Structure

- src/routes/ - application pages and user flows
- src/components/ - shared UI and layout components
- src/lib/ - API client and utility helpers
- public/ - static assets

## Prerequisites

- Node.js 18+ recommended
- npm or pnpm
- A running backend API that exposes the interview endpoints used by the frontend

## Environment Configuration

The frontend expects a backend at the following default URL:

- http://localhost:8000

You can override this by setting:

```bash
VITE_API_URL=http://your-backend-url
```

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

3. Open the local app in your browser:

```text
http://localhost:8080
```

## Available Scripts

```bash
npm run dev      # start the Vite development server
npm run build    # create a production build
npm run preview  # preview the production build locally
npm run lint     # run ESLint checks
npm run format   # format the codebase with Prettier
```

## Backend API Expectations

This frontend communicates with a backend API for the following actions:

- creating a session
- uploading a resume
- submitting a job description
- starting the interview flow
- submitting answers
- generating the final report

The expected endpoints are defined in src/lib/api.ts and include routes such as:

- POST /session
- POST /resume/upload
- POST /job-description
- POST /interview/start
- POST /interview/answer
- POST /interview/report

## License

This project is for educational and interview preparation purposes.

# Renaissance

Renaissance is a full-stack hiring platform designed to reduce bias during early-stage candidate evaluation through anonymous profiles, structured candidate data, and role-based workflows for job seekers and recruiters.

What was originally developed as a senior capstone project, Renaissance continues on as an independent portfolio project focused on human-centered system design, authentication, ranking systems, and full-stack web development.

## Problem Statement
 
Research suggests that unconscious bias can influence hiring decisions before meaningful skill evaluation occurs.Traditional hiring platforms often expose candidate names, photos, and demographic indicators before a recruiter evaluates relevant qualifications.


## Proposed Workflow:

- Job seekers create complete professional profiles.
- Candidate information is anonymized.
- Recruiters evaluate candidates based on qualifications first.
- Identity is revealed only after mutual interest is established.
-----------------------------------------------------------------------
The goal is not to eliminate bias entirely, but to encourage qualification-first evaluation.

## Architecture

![Architecture Diagram](architecture.png)

- Renaissance uses a Next.js frontend, Django backend, PostgreSQL database, Firebase Authentication, and a Java-based ranking engine.

## Screenshots

### Candidate Review
![Candidate Review](docs/images/candidate-review.png)

- Recruiters review anonymized candidate profiles before identifying information is revealed.

### Job Posting

![Job Posting](<job post 1.png>)

- Recruiters create structured job listings including education requirements, qualifications, salary ranges, and job descriptions.

### Recruiter Dashboard

![Recruiter Dashboard](<recruiter dashboard1.png>)

- Centralized dashboard for managing job postings, applicant rankings, and candidate interactions.

### Job Selection

![Job Selection](swipe.png)

- Recruiters can select active job listings and review ranked candidates for each position.

### Swipe Based Interface

![Swipe Interface](swipe1.png)

- Both Recruiters and seekers can utilize a swipe based interface instead of a traditional layout.

## System Capabilities

- Authentication
- Role-based onboarding workflows
- Account management
- Company management
- Resume handling
- Profile anonymization
- Candidate review workflow
- Matching workflow
- Ranking engine integration

## Technologies Used

### Frontend
- Next.js
- React
- TypeScript
- Tailwind CSS

### Backend
- Django
- Django REST Framework

### Database
- PostgreSQL

### Authentication
- Firebase Authentication

### Ranking Engine
- Java


## Features:

- Firebase Authentication
- Role-based access control
- Protected routes
- Candidate Profiles
- Resume upload
- Python based profile anonymization algorithm
- Company creation and management
- Job posting
- Candidate ranking
- Applicant review
- Job matching
- Swipe-based interaction model
- Ranking integration

## Python Based Anonymization Algorithm


Candidate profiles generate anonymized versions that remove identifying information while preserving job-relevant qualifications.

### Qualification-First Review

Recruiters initially evaluate:

- Skills
- Experience
- Education
- Qualifications

Rather than:

- Name
- Personal identifiers
- Other potentially bias-inducing information

Candidate and job information are normalized into structured formats to improve ranking consistency.

## Local Development

### Frontend
cd frontend
npm install
npm run dev
Backend
cd backend
python -m venv .venv
.venv\Scripts\activate

pip install -r requirements.txt

python manage.py runserver

### Environment Variables
Create:

frontend/.env.local

Using:

frontend/.env.example

Add Firebase configuration values.

### Firebase Admin SDK

Place the Firebase Admin SDK file at:

backend/renaissanceServiceAccountKey.json

This file is excluded from source control and should never be committed.

## Current focus areas:

- Deployment
- Automated testing
- Ranking algorithm improvements
- Company administration workflows
- Environment-based API configuration
- Data anonymization techniques

## Key Technical Challenges

### Anonymous Candidate Review

- Designing a workflow that hides identifying information while preserving meaningful qualifications for recruiter evaluation.

### Cross-Service Authentication

- Integrating Firebase Authentication with a Django backend while maintaining secure token validation and protected routes.

### Candidate Ranking

- Building a Java-based ranking engine that evaluates candidate qualifications against structured job requirements.

## Lessons Learned

- Designing role-based authentication flows
- Integrating Firebase Authentication with Django
- Building anonymization pipelines for candidate data
- Managing frontend/backend communication in a multi-service architecture
- Secure handling of environment variables and service account credentials
- Coordinating a Java ranking engine with a Python backend
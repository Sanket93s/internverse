# Internverse

Internverse is a full-stack internship management platform with role-based portals for Intern, Admin, and HR.

## Features
- Role-based authentication (Intern/Admin/HR)
- Sign up and sign in
- Forgot password (reset by email + role)
- Intern task tracking and submission
- Admin intern/task management
- HR evaluations and reports
- Performance dashboard and certificate API

## Tech Stack
- Frontend: React, TypeScript, Vite, Tailwind, shadcn-ui
- Backend: Spring Boot 3, Java 21, Spring Security, JWT
- Database: MongoDB

## Project Structure
- `src/` - React frontend
- `backend/` - Spring Boot backend

## Local Setup
### 1. Start MongoDB
Default backend DB URI:
`mongodb://localhost:27017/internverse`

### 2. Start Backend
From project root:

```bash
tools/apache-maven-3.9.9/bin/mvn.cmd -f backend/pom.xml spring-boot:run
```

Backend runs on:
`http://localhost:8081`

### 3. Start Frontend
From project root:

```bash
npm install
npm run dev
```

Frontend runs on:
`http://localhost:8080` (or `5173` if available)

## API Base URL
`http://localhost:8081/api`

## Main Auth Endpoints
- `POST /api/auth/signup`
- `POST /api/auth/login`
- `POST /api/auth/forgot-password`

## Demo Accounts
- `intern@internverse.com` / `password123`
- `admin@internverse.com` / `password123`
- `hr@internverse.com` / `password123`

## Notes
- Seed data is inserted only when Mongo collections are empty.
- CORS is configured for localhost frontend dev ports.

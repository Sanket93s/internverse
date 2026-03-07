# Internverse Spring Backend

This backend is a Spring Boot API for the existing React frontend.

## Stack
- Java 21
- Spring Boot 3
- Spring Web
- Validation
- In-memory data store (no database yet)

## Run
1. Install Maven 3.9+.
2. From `backend/` run:

```bash
mvn spring-boot:run
```

Server starts on `http://localhost:8081`.

## API base
`http://localhost:8081/api`

## Endpoints
- `GET /api/health`
- `POST /api/auth/login`
- `GET /api/tasks?internId=intern-1`
- `POST /api/tasks/submit`
- `POST /api/tasks/assign`
- `GET /api/submissions`
- `GET /api/interns`
- `POST /api/interns`
- `GET /api/evaluations`
- `POST /api/evaluations/submit`
- `GET /api/certificates/{internId}`
- `GET /api/performance/{internId}`

## Notes
- Data is seeded in memory and resets when the backend restarts.
- CORS is enabled for `http://localhost:5173`.
# Internverse Spring Backend

This backend is a Spring Boot API for the existing React frontend.

## Stack
- Java 21
- Spring Boot 3
- Spring Web
- Validation
- MongoDB (Spring Data MongoDB)

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
- Data is stored in MongoDB and seed data is inserted only when collections are empty.
- CORS is enabled for `http://localhost:5173`.

## MongoDB
Set MONGODB_URI (optional). Default: mongodb://localhost:27017/internverse.

# Car Demo Application

A full-stack web application built with Spring Boot and React for showcasing car listings.

## Features

- Browse latest car listings
- Explore different car models
- Admin dashboard for management

## Tech Stack

- **Backend:** Spring Boot (Java 21), JWT Security
- **Frontend:** React with TypeScript
- **Deployment:** Docker

## Running Locally

### Prerequisites
- Java 21+
- Maven
- Node.js & npm

### Running with Docker

1. Build the Docker image:
```bash
docker build -t demo-image --build-arg MAVEN_OPTS="-Dmaven.repo.local=/root/.m2" .
```

2. Run the image in a Docker container:
```bash
docker run -d -p 8080:8080 --env-file env.list -v ${PWD}/demo-data/database:/app/database -v ${PWD}/demo-data/uploads:/app/uploads --name demo-container demo-image
```

3. Access the application at `http://localhost:8080`

## Environment Variables

- `CRED` - BCrypt encoded admin password
- `JWT_SECRET` - The JWT secret used in tokens

FROM maven:3.9.9-eclipse-temurin-21 AS build
WORKDIR /app

COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests


# ===== Stage 2: Run the app =====
FROM eclipse-temurin:21-jdk-alpine
WORKDIR /app

COPY --from=build /app/target/*.jar app.jar

# Create necessary directories BEFORE switching to non-root user
RUN mkdir -p /app/uploads/vehicles && \
    mkdir -p /app/database && \
    adduser -D appuser && \
    chown -R appuser:appuser /app

# Copy demo data into the image
COPY --chown=appuser:appuser database /app/database
COPY --chown=appuser:appuser uploads /app/uploads

EXPOSE 8080

# Switch to non-root user
USER appuser

# Start the application
ENTRYPOINT ["java", "-jar", "app.jar"]


# Build image
# docker build -t demo-image --build-arg MAVEN_OPTS="-Dmaven.repo.local=/root/.m2" .

# Run the image, mounts demo-data and uses env.list
# docker run -d -p 8080:8080 --env-file env.list -v ${PWD}/database:/app/database -v ${PWD}/uploads:/app/uploads --name demo-container demo-image
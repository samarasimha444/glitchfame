# ---------- Build Stage ----------
FROM maven:3.9.9-eclipse-temurin-21 AS builder
WORKDIR /app

# 1. Copy only dependency descriptors (rarely change)
COPY pom.xml .

# 2. Download dependencies and cache them
RUN mvn -B -q dependency:go-offline

# 3. Copy source code (changes frequently)
COPY src ./src

# 4. Build application
RUN mvn -B -q package -DskipTests


# ---------- Runtime Stage ----------
FROM eclipse-temurin:21-jre-jammy
WORKDIR /app

# Copy built jar from builder stage
COPY --from=builder /app/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java","-jar","app.jar"]
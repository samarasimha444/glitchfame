# ---------- STAGE 1: Build ----------
FROM maven:3.9.6-eclipse-temurin-21 AS build

WORKDIR /app

# Copy only pom first (layer caching optimization)
COPY pom.xml .

# Download dependencies (cached unless pom changes)
RUN mvn dependency:go-offline

# Now copy source
COPY src ./src

# Build jar
RUN mvn clean package -DskipTests


# ---------- STAGE 2: Runtime ----------
FROM eclipse-temurin:21-jdk

WORKDIR /app

# Copy only built jar from builder stage
COPY --from=build /app/target/*.jar app.jar

EXPOSE 3000

ENTRYPOINT ["java", "-jar", "app.jar"]
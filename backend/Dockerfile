# ---------- STAGE 2: Runtime ----------
FROM eclipse-temurin:21-jdk

WORKDIR /app

COPY --from=build /app/target/*.jar app.jar

EXPOSE 3000

ENTRYPOINT ["java","-jar","app.jar","--spring.profiles.active=prod"]
<<<<<<< HEAD
# ---- build stage ----
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
RUN mvn -q -e -DskipTests dependency:go-offline
COPY src ./src
RUN mvn -q -DskipTests clean package

# ---- run stage ----
FROM eclipse-temurin:17-jre
WORKDIR /app

# Copy jar (adjust if jar name differs)
COPY --from=build /app/target/*.jar app.jar

EXPOSE 8083
ENV SERVER_PORT=8083

ENTRYPOINT ["java","-jar","/app/app.jar"]
=======
# Build stage
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline -B
COPY src ./src
RUN mvn clean package -DskipTests

# Run stage
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8084
ENTRYPOINT ["java", "-jar", "app.jar"]
>>>>>>> ed2092798d899258e73e136559f217854ecc8c72

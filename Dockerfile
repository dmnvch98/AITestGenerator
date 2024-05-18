FROM openjdk:21-slim

WORKDIR /app

COPY target/server.jar server.jar

ENTRYPOINT ["java", "-jar", "server.jar", "--spring.profiles.active=demo"]

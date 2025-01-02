# Generation Service Project

This project consists of three main components:
1. **Docker**: For dependencies and environment setup.
2. **Server**: A Spring Boot backend.
3. **Client**: A React frontend.

The guide below will help you set up and run the project locally.

---

## Prerequisites
- **Docker** and **Docker Compose** installed
- **Java 17** or higher
- **Maven** installed (if you're not using the Maven wrapper).
- **Node.js** and **npm** (or **yarn**)

---

## 1. Setting Up Environment Variables

Set the project directory path as an environment variable for easier navigation:

### For Linux/Mac:
1. Run the following commands in the terminal:
   ```bash
   echo "export GEN_TEST_HOME=$(pwd)" >> ~/.zshrc
   source ~/.zshrc

## 2. Setting Up the SSL Certificate in Your Browser

Since the backend server runs on HTTPS with a self-signed certificate, you need to configure your browser to trust the certificate for local development.

1. Open your browser and navigate to: https://localhost:8080
2. You will see a security warning, such as **"Your connection is not private"** or similar.


## 3.Setting Up Docker

The project uses Docker to manage its dependencies and environment. Follow these steps to set up and run the Docker containers.

1. Navigate to the project directory:
   ```bash
   cd $GEN_TEST_HOME
   docker-compose up -d

## 3.Building and Running the server

The backend of the project is a Spring Boot application. Follow these steps to build and run it using Maven.

1. Navigate to the server directory:
   ```bash
   cd $GEN_TEST_HOME/generation-service
   
2. Build the project:
   ```bash
   ./mvnw clean install
   
3. Ask for the .env file with environment variables for the project

4. Open the next class in IDE com/example/generation_service/AiTestGeneratorApplication.java and setup run configuration to use file with env variables and run the project

## 4.Running the client

The backend of the project is a Spring Boot application. Follow these steps to build and run it using Maven.

1. Navigate to the client directory:
   ```bash
   cd $GEN_TEST_HOME/client
   
2. Install deps:
   ```bash
   npm install
   
3. Run client:
   ```bash
   npm run start
---
description: Repository Information Overview
alwaysApply: true
---

# Repository Information Overview

## Repository Summary
This repository contains a full-stack Leave Management System with a React frontend and Spring Boot backend. The system appears to handle employee attendance, leave management, task tracking, and user authentication.

## Repository Structure
- **my-app/**: React frontend application
- **Backend/**: Spring Boot backend application
- **target/**: Build output directory for the root project

### Main Repository Components
- **Frontend (my-app)**: React-based UI for the leave management system
- **Backend**: Spring Boot API with MongoDB for data storage
- **Root Project**: Parent Maven project that likely coordinates both components

## Projects

### Frontend (my-app)
**Configuration File**: package.json

#### Language & Runtime
**Language**: JavaScript/React
**Version**: React 19.1.0
**Package Manager**: npm

#### Dependencies
**Main Dependencies**:
- react: ^19.1.0
- react-dom: ^19.1.0
- react-router-dom: ^7.5.0
- axios: ^1.9.0
- http-proxy-middleware: ^3.0.5
- lucide-react: ^0.503.0
- react-icons: ^5.5.0

#### Build & Installation
```bash
cd my-app
npm install
npm start
```

#### Testing
**Framework**: Jest with React Testing Library
**Test Location**: src/
**Naming Convention**: *.test.js
**Run Command**:
```bash
npm test
```

### Backend
**Configuration File**: pom.xml

#### Language & Runtime
**Language**: Java
**Version**: Java 17
**Build System**: Maven
**Framework**: Spring Boot 3.4.5

#### Dependencies
**Main Dependencies**:
- spring-boot-starter-data-mongodb
- spring-boot-starter-security
- spring-boot-starter-web
- spring-boot-starter-validation
- io.jsonwebtoken:jjwt-api:0.11.5
- lombok

#### Build & Installation
```bash
cd Backend
./mvnw clean install
./mvnw spring-boot:run
```

#### Testing
**Framework**: JUnit 5 with Spring Boot Test
**Test Location**: src/test/java/com/example/Backend
**Configuration**: Spring Boot Test annotations
**Run Command**:
```bash
./mvnw test
```

### Root Project (leave-management)
**Configuration File**: pom.xml

#### Language & Runtime
**Language**: Java
**Version**: Java 11
**Build System**: Maven
**Framework**: Spring Boot 2.7.0

#### Dependencies
**Main Dependencies**:
- spring-boot-starter-web
- spring-boot-starter-data-mongodb
- spring-boot-starter-security
- io.jsonwebtoken:jjwt:0.9.1
- lombok
- spring-boot-starter-validation

#### Build & Installation
```bash
mvn clean install
```
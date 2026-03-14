# Reactive Blog Backend

A robust, reactive blog backend service built with Spring Boot, Spring Data R2DBC, and PostgreSQL. This project demonstrates best practices in reactive programming, including automated slug generation, structured error handling, and decoupled validation logic.

## Tech Stack

- **Java 25**
- **Spring Boot 4.0.3**
- **Spring Data R2DBC** (Reactive Relational Database Connectivity)
- **PostgreSQL**
- **Liquibase** (Database Migrations)
- **Lombok**
- **Docker Compose** (for local development)

## Features

- **Reactive CRUD**: Fully non-blocking API for managing blog posts.
- **Automated Slug Generation**: Titles are automatically converted into URL-friendly slugs if not provided.
- **Robust Validation**: Sanity checks for post creation and updates handled by a dedicated validation service.
- **Structured Error Handling**: Custom exceptions and structured JSON error responses (e.g., 409 Conflict for duplicate slugs, 400 Bad Request for invalid inputs).
- **Database Schema**: Optimized schema with indexes and foreign key constraints (Post and Comment tables).

## Getting Started

### Prerequisites

- JDK 25
- Docker (for PostgreSQL via Docker Compose)

### Running the Application

1. **Start the Database**:
   ```bash
   docker compose up -d
   ```

2. **Run the Application**:
   ```bash
   ./gradlew bootRun
   ```

The application will be available at `http://localhost:8080`.

## API Testing

You can find sample HTTP requests for testing the API in:
`scratches/temp/test-posts.http`

## Documentation of the Development Journey

This project was built iteratively. For a detailed step-by-step breakdown of how this backend was designed and implemented, including the prompts and design decisions, please refer to:

👉 **[steps.md](./steps.md)**

---

Created with ❤️ using Spring Boot and R2DBC.
# Finance Data Processing Backend

A logically structured and efficient backend for a finance dashboard system, allowing different user roles to interact with financial records and overview aggregations safely. Built with **Node.js, Express, TypeScript, Zod,** and **Prisma ORM (SQLite)**.

## Architecture and Structure
Following a layered architecture pattern:
1. **Application Layer (`app.ts`, `server.ts`)**: Server and middleware composition.
2. **Routes Layer (`*.routes.ts`)**: Express Routers wiring incoming HTTP endpoints to middlewares and controllers.
3. **Controllers Layer (`*.controller.ts`)**: Extract Request/Response properties and structure HTTP replies.
4. **Service Layer (`*.service.ts`)**: Handle Database queries, transactions, aggregations, and core business rules.
5. **Persistence Layer (`prisma/`)**: ORM bindings mapped directly to a local, fully containerizable SQLite file (`dev.db`).

## Setup Instructions
1. **Install dependencies:** `npm install`
2. **Setup environment:** Make sure you have `.env` (by default it uses `./dev.db`)
3. **Run Migrations:** `npx prisma migrate dev`
4. **Start the development server:** `npm run dev`

### Helpful Scripts
- `npm run db:reset` - Completely wipes the database (useful before hosting/deploying or just resetting state).
- `npm run test` - Runs Jest unit/integration tests.

## Access Control & Roles
- **VIEWER**: Can access Dashboard analytics passively.
- **ANALYST**: Can fetch all records and access Dashboard analytics.
- **ADMIN**: Has unrestricted access to create, update, delete, filter records, and dashboard data.

## API Documentation

**Interactive API Docs (Swagger UI):** Once you run the application, an interactive Swagger interface is available at `http://localhost:3000/api-docs`. This lets you view schemas, execute test requests, and authenticate dynamically.

### 1. Authentication (`/api/auth`)
- `POST /register`: Register a new user (with payload `email`, `password`, `role`).
- `POST /login`: Logs a user in and returns a JWT Bearer token.

### 2. Financial Records (`/api/records`)
- **Headers:** `Authorization: Bearer <token>`
- `GET /` (ANALYST, ADMIN): List records. Supports filtering (`?type=INCOME&category=Salary&startDate=...`), **Searching** (`?search=foo`), and **Pagination** (`?page=1&limit=10`). 
  - *Response includes `{ data, meta }`.*
- `POST /` (ADMIN): Create a record (`amount`, `type`, `category`, `date`, `notes`)
- `PUT /:id` (ADMIN): Update a record
- `DELETE /:id` (ADMIN): **Soft deletes** a record safely (sets `deletedAt`).

### 3. Dashboard Analytics (`/api/dashboard`)
- **Headers:** `Authorization: Bearer <token>`
- `GET /summary` (VIEWER, ANALYST, ADMIN): Aggregates net balance, expenses, incomes, category splits, and latest 5 operations immediately from the DB using optimized Prisma aggregations. **Response is cached automatically for 5 minutes.**

### 4. Security & Rate Limiting
- **Global Rate Limiting:** All endpoints are limited to 100 requests per 15 minutes.
- **Strict Auth Limiting:** Login and Registration are strictly limited to 10 attempts per hour.

# FlowPilot AI

**AI Project Management & Team Collaboration Platform**

> Dự án portfolio cá nhân được xây dựng theo quy trình Lean Agile, triển khai với Modular Monolith Architecture.

---

## Technology Stack

| Layer | Technology | Version |
|---|---|---|
| **Frontend** | React | 19.3.1 |
| **Frontend** | Vite | 8.3.8 |
| **Frontend** | TypeScript | 5.9.3 |
| **Frontend** | Tailwind CSS | 4.x |
| **Frontend** | React Router | 7.x |
| **Frontend** | TanStack Query | 5.x |
| **Frontend** | shadcn/ui | (New York style) |
| **Frontend** | Axios | latest |
| **Backend** | Node.js | 24 LTS |
| **Backend** | Express.js | 5.x |
| **Backend** | TypeScript | 5.9.3 |
| **Backend** | Prisma ORM | 7.x |
| **Backend** | Zod | latest |
| **Backend** | Pino Logger | latest |
| **Backend** | Socket.IO | (planned) |
| **Database** | PostgreSQL | 17 (port 5434) |
| **Testing** | Vitest | 5.x |
| **Testing** | Supertest | latest |
| **Testing** | React Testing Library | latest |
| **Testing** | Playwright | (planned) |
| **DevOps** | GitHub Actions | CI/CD |
| **DevOps** | npm | 11.x |

---

## Architecture Overview

- **System:** Modular Monolith với Feature-based Architecture kết hợp Layered Architecture
- **Backend Request Flow:** `HTTP Request → Express Router → Middleware → Controller → Service → Repository → Prisma ORM → PostgreSQL`
- **Real-time:** Socket.IO (planned) với JWT authentication trong WebSocket handshake
- **AI Workflow:** Provider Abstraction Pattern (OpenAI / Gemini / other), Human-in-the-loop approval

---

## Project Structure

```text
flowpilot-ai/                        # Monorepo root
├── backend/                         # Node.js + Express.js + TypeScript
│   ├── prisma/
│   │   ├── schema.prisma            # Prisma schema for users and refresh tokens
│   │   └── migrations/              # Prisma Migrate history (Sprint 1+)
│   ├── src/
│   │   ├── config/                  # env.ts, logger.ts, prisma.ts, cors.ts
│   │   ├── errors/                  # app-error.ts, error-codes.ts
│   │   ├── middlewares/             # request-id, rate-limit, not-found, error handler
│   │   ├── modules/                 # Feature modules (Sprint 1+): auth, workspace, project, task, board…
│   │   ├── routes/                  # index.ts — GET /health
│   │   ├── types/                   # express.d.ts augmentation
│   │   ├── generated/prisma/        # Prisma generated client (git-ignored)
│   │   ├── app.ts                   # Express app factory
│   │   └── server.ts                # HTTP server + graceful shutdown
│   ├── tests/
│   │   ├── setup.ts                 # Vitest global setup
│   │   └── integration/
│   │       └── health.integration.test.ts
│   ├── .env                         # Local environment (git-ignored)
│   ├── .env.example                 # Template (committed)
│   ├── package.json
│   ├── tsconfig.json
│   ├── vitest.config.ts
│   ├── eslint.config.js
│   └── prisma.config.ts             # Prisma 7 config (datasource URL)
├── frontend/                        # React + Vite + TypeScript SPA
│   ├── src/
│   │   ├── app/
│   │   │   ├── providers/           # QueryProvider, AppProviders
│   │   │   └── router/              # AppRouter
│   │   ├── components/common/       # ErrorBoundary
│   │   ├── lib/                     # env.ts, query-client.ts
│   │   ├── pages/                   # InitStatusPage (health dashboard)
│   │   ├── services/                # api-client.ts (Axios)
│   │   ├── styles/                  # index.css (Tailwind v4)
│   │   ├── types/                   # api.types.ts
│   │   ├── utils/                   # cn.util.ts
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── vite-env.d.ts
│   ├── tests/
│   │   ├── setup.ts
│   │   └── unit/
│   │       └── init-status.test.tsx
│   ├── .env                         # Local environment (git-ignored)
│   ├── .env.example                 # Template (committed)
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   ├── vitest.config.ts
│   ├── eslint.config.js
│   └── components.json              # shadcn/ui config
├── docs/                            # Technical documentation (01–08)
│   ├── 01-PRD.md
│   ├── 02-SRS.md
│   ├── 03-Use-Cases.md
│   ├── 04-System-Design.md
│   ├── 05-Database-Design.md
│   ├── 06-API-Specification.yaml
│   ├── 07-Backlog-Roadmap.md
│   └── 08-Test-Plan.md
├── .github/
│   └── workflows/
│       └── ci.yml                   # GitHub Actions: lint + typecheck + test + build
├── .gitignore
├── .editorconfig
└── README.md
```

---

## Prerequisites

| Requirement | Version | Notes |
|---|---|---|
| Node.js | 24 LTS | `node --version` |
| npm | 11.x | bundled with Node.js 24 |
| PostgreSQL | 17 | Running on **port 5434** (Windows service: `postgresql-x64-17`) |
| Git | any | |

---

## Environment Variables

### Backend — `backend/.env`

Copy từ `backend/.env.example` và điền giá trị thực:

```env
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://postgres:<PASSWORD>@localhost:5434/flowpilot_ai
FRONTEND_URL=http://localhost:5173
CORS_ORIGIN=http://localhost:5173
LOG_LEVEL=info
JWT_ACCESS_SECRET=<RANDOM_64_HEX_CHARACTERS>
```

Backend yêu cầu `JWT_ACCESS_SECRET` là khóa ngẫu nhiên 32 byte ở dạng hex. Để chạy local với khóa chỉ tồn tại trong phiên PowerShell hiện tại:

```powershell
$env:JWT_ACCESS_SECRET = node -p "require('node:crypto').randomBytes(32).toString('hex')"
npm --prefix backend run dev
```

Để chạy integration tests, tạo PostgreSQL local database `flowpilot_ai_test`, rồi sao chép `backend/.env.test.example` thành `backend/.env.test` và điền thông tin kết nối test. Từ repository root:

```powershell
npm --prefix backend run test:db:migrate
npm --prefix backend run test:integration
npm --prefix backend run test:unit
```

`test:integration` yêu cầu cấu hình test database. `npm --prefix backend test` chạy toàn bộ suite và bỏ qua các ca cần PostgreSQL nếu thiếu cấu hình test.

### Frontend — `frontend/.env`

Copy từ `frontend/.env.example`:

```env
VITE_API_BASE_URL=http://localhost:3000/api/v1
VITE_SOCKET_URL=http://localhost:3000
```

---

## Database Setup

Tạo database lần đầu (chạy một lần):

```powershell
# Windows PowerShell
psql -U postgres -p 5434 -h localhost -c "CREATE DATABASE flowpilot_ai;"
```

---

## Installation

```powershell
# Backend
npm --prefix backend install

# Frontend
npm --prefix frontend install

# Prisma generate (backend)
npm --prefix backend run prisma:generate
```

---

## Running the Project

> **Windows PowerShell Note:** Dùng dấu `;` thay vì `&&` khi chain commands.

### Backend (port 3000)

```powershell
npm --prefix backend run dev
```

### Frontend (port 5173)

```powershell
npm --prefix frontend run dev
```

### Health Check

```
GET http://localhost:3000/health
```

**Response khi DB kết nối thành công:**
```json
{
  "status": "ok",
  "services": {
    "api": "up",
    "database": "up"
  }
}
```

---

## Development Commands

### Backend

```powershell
npm --prefix backend run dev          # Start dev server (tsx watch)
npm --prefix backend run build        # TypeScript compile → dist/
npm --prefix backend run lint         # ESLint
npm --prefix backend run typecheck    # TypeScript type check
npm --prefix backend run format       # Prettier check
npm --prefix backend run format:write # Prettier format
npm --prefix backend run test         # Vitest (integration tests)
npm --prefix backend run prisma:generate  # Generate Prisma client
```

### Frontend

```powershell
npm --prefix frontend run dev         # Vite dev server
npm --prefix frontend run build       # TypeScript + Vite production build
npm --prefix frontend run preview     # Preview production build
npm --prefix frontend run lint        # ESLint
npm --prefix frontend run typecheck   # TypeScript type check
npm --prefix frontend run format      # Prettier check
npm --prefix frontend run format:write# Prettier format
npm --prefix frontend run test        # Vitest (unit tests)
```

---

## CI/CD

GitHub Actions (`ci.yml`) chạy tự động trên mỗi push/PR:

1. **Backend job:** `npm ci` → `prisma:generate` → `lint` → `typecheck` → `format` → `test` → `build`
2. **Frontend job:** `npm ci` → `lint` → `typecheck` → `format` → `test` → `build`

---

## Development Status

| Phase | Status |
|---|---|
| Product Planning | ✅ Done |
| Requirements Analysis | ✅ Done |
| System Design | ✅ Done |
| Project Scaffolding | ✅ Done |
| **Project Initialization** | ✅ **Done** |
| Sprint 1 — Foundation + AUTH | In Progress — Authentication schema and migration applied on development |

**Initialization includes:**
- Backend: Express 5 + TypeScript + Prisma 7 + Pino + Zod + Helmet + CORS + Rate Limit + Error Handling + Health Check
- Frontend: React 19 + Vite 8 + TypeScript + Tailwind v4 + TanStack Query + Axios + shadcn/ui
- Testing: Vitest (backend 4/4 ✅, frontend 1/1 ✅)
- CI: GitHub Actions pipeline configured
- Database: PostgreSQL 17 connected, Prisma schema initialized

---

## Documentation

Xem [Sprint Index](docs/sprints/README.md) để tra cứu phạm vi và trạng thái Task, và [báo cáo triển khai](docs/reports/README.md) để tra cứu bằng chứng.

| # | Document | Description |
|---|---|---|
| 01 | [PRD](docs/01-PRD.md) | Product Requirements Document |
| 02 | [SRS](docs/02-SRS.md) | Software Requirements Specification |
| 03 | [Use Cases](docs/03-Use-Cases.md) | Use Case Specification |
| 04 | [System Design](docs/04-System-Design.md) | Architecture & System Design |
| 05 | [Database Design](docs/05-Database-Design.md) | PostgreSQL & Prisma Schema |
| 06 | [API Specification](docs/06-API-Specification.yaml) | OpenAPI 3.0.3 |
| 07 | [Backlog & Roadmap](docs/07-Backlog-Roadmap.md) | Product Backlog & Sprint Plan |
| 08 | [Test Plan](docs/08-Test-Plan.md) | Test Plan & Test Cases |

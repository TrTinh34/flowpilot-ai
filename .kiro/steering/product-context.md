---
inclusion: always
---

# FlowPilot AI — Product Context

## Tổng quan sản phẩm

**FlowPilot AI** là AI-powered Project Management và Team Collaboration Platform dành cho software development teams, project managers, startups và small businesses.

**Tagline:** Plan smarter. Build together.

**Type:** Commercial SaaS.

## Công nghệ hiện tại

### Frontend (đã cài đặt)
- React 19, TypeScript, Vite 8, Tailwind CSS v4, shadcn/ui (new-york style)
- TanStack Query v5, React Router v7, Axios
- Vitest v5, React Testing Library, jsdom

### Frontend (dự kiến theo Sprint plan)
- Zustand, React Hook Form, Zod, dnd-kit, Recharts, Socket.IO Client, Sonner, Lucide React

**Lưu ý:** Chỉ cài thêm dependency khi Sprint tương ứng được phê duyệt.

### Backend (đang chạy)
- Node.js, Express.js, TypeScript, Prisma ORM, PostgreSQL
- Kiến trúc nội bộ: Feature-based Clean Architecture (`domain/`, `application/`, `infrastructure/`, `presentation/`, Composition Root `<module>.module.ts`) trong Modular Monolith (đã migrate module `auth`; `workspace`/`project` giữ tương thích từ Sprint 2)
- JWT (access token 15 phút, in-memory), Refresh token (7 ngày, HttpOnly SameSite=Lax cookie)
- Zod validation, Pino logger, bcrypt

## Repository Structure

```
d:\flowpilot-ai\
├── frontend/           # React + Vite app
│   └── src/
│       ├── app/        # providers, router, store
│       ├── components/ # ui/ (shadcn), common/
│       ├── features/   # feature modules (auth, workspace, task, …)
│       ├── layouts/    # AuthLayout, AppShellLayout
│       ├── pages/      # route-level pages
│       ├── services/   # api-client.ts (axios)
│       ├── lib/        # env.ts, query-client.ts
│       ├── styles/     # index.css (design tokens)
│       ├── types/      # shared TypeScript types
│       └── utils/      # cn.util.ts, date.util.ts
├── backend/            # Express.js API
├── docs/               # PRD, SRS, Use Cases, System Design, OpenAPI, Backlog, sprints/, reports/
└── .kiro/              # Kiro specs và steering
```

## Trạng thái triển khai hiện tại

- Backend Sprints 01–03 & 05: COMPLETED (`auth` Clean Architecture; `workspace`, `project`, `task`, `board`, `collaboration` mounted và verified trên PostgreSQL test).
- Frontend Sprints 04, 06 (Timebox A 5/5), 07 (Timebox B 6/6, chờ Developer Review), 08 (`REDESIGN-11` COMPLETED; `REDESIGN-12..16` PENDING).
- Đang ở giai đoạn **Frontend Re-audit & Refinement Planning** (`REFINE-01..02` `IN_REVIEW`, `REFINE-03..07` `PENDING` chờ Developer Approval).
- Nguồn trạng thái chính thức: `docs/sprints/README.md` và `docs/reports/README.md`.

## Security model

- Access token: JWT, lưu in-memory (không localStorage, không cookie)
- Refresh token: HttpOnly SameSite=Lax cookie, path `/api/v1/auth`
- `withCredentials: true` trên axios client
- Không được move refresh token ra khỏi cookie

## Nguồn tham khảo

- OpenAPI contract: `docs/06-API-Specification.yaml`
- Sprint plan: `docs/sprints/sprint-01-authentication/README.md`
- Product Backlog: `docs/07-Backlog-Roadmap.md`
- System Design (token/security): `docs/04-System-Design.md`

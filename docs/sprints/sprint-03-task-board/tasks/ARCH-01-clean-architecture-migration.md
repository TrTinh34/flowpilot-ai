# ARCH-01 — Migrate Backend Auth Module to Feature-based Clean Architecture

- **Sprint:** Sprint 03 — Task & Board
- **Status:** COMPLETED
- **Dependencies:** Sprint 01 Auth (AUTH-01..AUTH-12, AUTH-INT-01), Sprint 02 (WS-01..PROJ-03)
- **Related ADR:** [ADR-001](../../../architecture/decisions/ADR-001-adopt-clean-architecture.md)
- **Report:** [Architecture Refactoring Report](../../../reports/architecture/clean-architecture-refactoring.md)

## Objective

Chuyển đổi kiến trúc nội bộ backend từ Layered Architecture sang **Feature-based Clean Architecture** bên trong **Modular Monolith**, lấy module `auth` làm chuẩn mực đầu tiên, không làm thay đổi API contracts, database schema/migrations, security guarantees, hay frontend behavior.

## Scope

- Thiết lập Shared Kernel (`shared/domain/errors/`, `shared/application/errors/`).
- Tách module `auth` thành 4 tầng: `domain/`, `application/`, `infrastructure/`, `presentation/`, cùng Composition Root `auth.module.ts` và public contract `index.ts`.
- Gỡ bỏ các file `auth` cũ theo Layered Architecture sau khi kiểm chứng.
- Bổ sung automated architecture fitness tests (`tests/architecture/clean-architecture.test.ts`).
- Đồng bộ `docs/04-System-Design.md` (12 Mermaid diagrams), ADR-001, `AGENTS.md`, `README.md`, `.kiro/steering/`, Sprint/Task docs, và historical reports.

## Acceptance Criteria

- AC-01..AC-30 theo đặc tả Architecture Refactoring (xem chi tiết tại [Architecture Refactoring Report](../../../reports/architecture/clean-architecture-refactoring.md)).

## Verification Requirements

- `npm --prefix backend run test:unit` (62/62 passed)
- `npm --prefix backend run test:integration` (36/36 passed on PostgreSQL `flowpilot_ai_test`)
- `npm --prefix backend run test:architecture` (5/5 passed)
- `npm --prefix backend run typecheck`, `lint`, `build` (passed)
- `npm --prefix frontend run typecheck`, `build`, `test` (58/58 passed)

# Báo cáo Architecture Refactoring — Migrate Backend sang Feature-based Clean Architecture

## 1. Task Information

- **Task ID:** ARCH-01
- **Task Name:** Migrate Backend Auth Module to Feature-based Clean Architecture
- **Sprint:** Sprint 03 — Task & Board
- **Date:** 2026-11-27
- **Status:** COMPLETED
- **Related Requirements:** FR-AUTH-01, NFR-SEC-01..04, System Architecture
- **Related ADR:** [ADR-001](../../architecture/decisions/ADR-001-adopt-clean-architecture.md)

---

## 2. Architecture Assessment

### Kiến trúc trước đó (Layered Architecture)
- **Style:** Modular Monolith với Feature-based Architecture, bên trong mỗi module dùng Layered Architecture (`routes → controller → service → repository → prisma`).
- **Điểm mạnh sẵn có:**
  - Phân tách feature module rõ ràng (`auth`, `workspace`, `project`, `task`, ...).
  - Bảo mật auth tốt: `bcrypt` cost 12 + dummy hash timing mitigation, `jose` HS256 `at+jwt`, SHA-256 refresh token hashing, `ReadCommitted` + `pg_advisory_xact_lock` cho refresh rotation & reuse revocation.
  - Global error handler chuẩn hóa `{ code, message, requestId }` và Zod strict validation.
- **Vấn đề phụ thuộc đã xác định:**
  1. `auth.session.ts` và `auth.service.ts` phụ thuộc trực tiếp vào `prisma`, `logger`, `auth.tokens.ts` (`jose`), `crypto.util.ts` (`bcryptjs`), và `auth.repository.ts`.
  2. Business logic ném `AppError` gắn HTTP status code (`401`, `404`, `409`, `500`), trộn lẫn tầng Application và Presentation.
  3. `auth.repository.ts` để rò rỉ `PrismaClientKnownRequestError` lên tầng service để kiểm tra `P2002`.
  4. `src/middlewares/auth.middleware.ts` import trực tiếp `jose` (`errors.JOSEError`) và `verifyAccessToken`.
  5. Unit test phải dùng `vi.mock` ở cấp module nội bộ (`prisma.js`, `auth.repository.js`, `refresh-token.repository.js`) thay vì inject fake Ports.

---

## 3. Target Architecture

- **Architecture Style:** Modular Monolith.
- **Code Organization:** Feature-based Architecture.
- **Backend Internal Architecture:** Clean Architecture (4 tầng: `Domain`, `Application`, `Infrastructure`, `Presentation`) + Constructor Injection + Composition Root (`auth.module.ts`).
- **Dependency Rule:**
  - `Domain` không phụ thuộc vào `Application`, `Infrastructure`, `Presentation`, hay framework ngoài.
  - `Application` chỉ phụ thuộc vào `Domain` và các `Ports` của chính nó.
  - `Infrastructure` implement các `Ports` từ `Application`.
  - `Presentation` chỉ phụ thuộc vào `Application` (Use Cases, DTOs) và `Domain` contracts/errors.
- **Transaction Boundaries:** `AuthUnitOfWork` (`PrismaAuthUnitOfWork`) đảm bảo `ReadCommitted` transaction và `pg_advisory_xact_lock` dùng chung `Prisma.TransactionClient` cho mọi repository call bên trong transaction.

---

## 4. Implementation Summary

- **Shared Kernel:**
  - `backend/src/shared/domain/errors/error-codes.ts` (`ERROR_CODES`)
  - `backend/src/shared/domain/errors/domain-error.ts` (`DomainError`)
  - `backend/src/shared/application/errors/application-error.ts` (`ApplicationError`)
- **Auth Domain (`backend/src/modules/auth/domain/`):**
  - `entities/user.entity.ts`: `PublicUser`, `UserCredentials`, `normalizeEmail()`
  - `entities/refresh-token.entity.ts`: `RefreshTokenRecord`, `isValidRefreshTokenFormat()`, `isRefreshTokenExpired()`, `isRefreshTokenRevoked()`
  - `errors/auth.errors.ts`: `EmailAlreadyExistsError`, `InvalidCredentialsError`, `InvalidRefreshTokenError`, `UserNotFoundError`, `UnauthorizedError`
- **Auth Application (`backend/src/modules/auth/application/`):**
  - **Ports:** `UserRepository`, `RefreshTokenRepository`, `AuthUnitOfWork`, `PasswordHasher`, `AccessTokenIssuer`, `AccessTokenVerifier`, `RefreshTokenService`, `AuthLogger`
  - **DTOs:** `RegisterUserInput`, `LoginUserInput`, `PublicUserDto`, `AuthSessionDto`
  - **Use Cases:** `RegisterUserUseCase`, `LoginUserUseCase`, `RefreshSessionUseCase`, `LogoutUseCase`, `GetCurrentUserUseCase`
- **Auth Infrastructure (`backend/src/modules/auth/infrastructure/`):**
  - `PrismaUserRepository` (dịch `P2002` trên `users_email_lower_uidx` → `EmailAlreadyExistsError`)
  - `PrismaRefreshTokenRepository`
  - `PrismaAuthUnitOfWork`
  - `BcryptPasswordHasher`
  - `JoseTokenService` (nhận `jwtAccessSecret` qua constructor, dịch `JOSEError` → `UnauthorizedError`)
  - `PinoAuthLogger`
- **Auth Presentation (`backend/src/modules/auth/presentation/`):**
  - `AuthController` (constructor injection 5 Use Cases + `isProduction`)
  - `createAuthRouter`, `createAuthenticateMiddleware`, `registerSchema`/`loginSchema`, `toAuthAppError`
- **Composition Root & Public Contract:**
  - `backend/src/modules/auth/auth.module.ts` (`createAuthModule`, `authModule`)
  - `backend/src/modules/auth/index.ts` (public exports)
- **Removed Obsolete Files:**
  - `auth.controller.ts`, `auth.repository.ts`, `auth.routes.ts`, `auth.schema.ts`, `auth.service.ts`, `auth.session.ts`, `auth.tokens.ts`, `auth.types.ts`, `refresh-token.repository.ts`.

---

## 5. File Migration Mapping

| Previous File Path | New File Path | Responsibility | Reason for Migration |
|---|---|---|---|
| `backend/src/errors/error-codes.ts` | `backend/src/shared/domain/errors/error-codes.ts` (re-export tại file cũ) | Error code constants | Tách error codes khỏi HTTP layer để Domain dùng được |
| `backend/src/modules/auth/auth.types.ts` | `backend/src/modules/auth/domain/entities/*.ts`, `application/dtos/auth.dtos.ts` | Domain entities & DTOs | Thay thế placeholder TODO bằng contracts rõ ràng |
| `backend/src/modules/auth/auth.schema.ts` | `backend/src/modules/auth/presentation/schemas/auth.schemas.ts` | Zod HTTP request validation | Chuyển HTTP validation về tầng Presentation |
| `backend/src/modules/auth/auth.service.ts` | `application/use-cases/{register-user,login-user,get-current-user}.use-case.ts` | Business use cases | Tách nghiệp vụ khỏi Prisma, bcrypt và HTTP status codes |
| `backend/src/modules/auth/auth.session.ts` | `application/use-cases/{login-user,refresh-session,logout}.use-case.ts` | Session & rotation orchestration | Tách transaction orchestration qua `AuthUnitOfWork` Port |
| `backend/src/modules/auth/auth.repository.ts` | `infrastructure/repositories/prisma-user.repository.ts` | Prisma user persistence | Implement `UserRepository` Port, đóng gói Prisma error |
| `backend/src/modules/auth/refresh-token.repository.ts` | `infrastructure/repositories/prisma-refresh-token.repository.ts` | Prisma refresh token persistence | Implement `RefreshTokenRepository` Port |
| `backend/src/modules/auth/auth.tokens.ts` | `infrastructure/security/jose-token.service.ts` | JWT & refresh token crypto | Implement Token Ports qua Constructor Injection |
| `backend/src/middlewares/auth.middleware.ts` | `presentation/middlewares/authenticate.middleware.ts` (re-export tại file cũ) | Express Bearer auth middleware | Tách middleware khỏi `jose`, chỉ phụ thuộc `AccessTokenVerifier` |
| `backend/src/modules/auth/auth.controller.ts` | `presentation/controllers/auth.controller.ts` + `presenters/auth-error.presenter.ts` | Express HTTP controller & error mapping | Inject Use Cases, map DomainError → `AppError` |
| `backend/src/modules/auth/auth.routes.ts` | `presentation/routes/auth.routes.ts` + `auth.module.ts` | Express router & DI wiring | Tách route factory khỏi global singletons |

---

## 6. Technical Decisions & Trade-offs

1. **Manual Constructor Injection thay vì DI Framework:** `auth.module.ts` đóng vai trò Composition Root, đơn giản, type-safe 100%, không thêm runtime overhead hay decorators.
2. **Domain Errors không mang HTTP Status Code:** Use Cases ném `DomainError` / `ApplicationError`; `toAuthAppError` ở tầng Presentation ánh xạ sang HTTP status code tương ứng.
3. **Incremental Migration:** Chỉ migrate `auth` trong phạm vi task này; `workspace` và `project` (Sprint 2) giữ nguyên hoạt động ổn định và import `authenticate` / `accessTokenIssuer` qua public contract `modules/auth/index.ts`.

---

## 7. Documentation Updates

- `docs/architecture/decisions/ADR-001-adopt-clean-architecture.md` (Created)
- `docs/04-System-Design.md` (Updated — Clean Architecture + 12 Mermaid diagrams)
- `README.md` (Updated — Architecture Overview)
- `AGENTS.md` (Updated — Clean Architecture backend rules)
- `.kiro/steering/product-context.md`, `.kiro/steering/frontend-architecture.md` (Updated)
- `docs/sprints/sprint-03-task-board/README.md`, `tasks/ARCH-01-clean-architecture-migration.md` (Updated / Created)
- `docs/reports/01-authentication/AUTH-{02,03,04,05,06,07,12,INT-01}*.md` (Appended Architecture Refactoring Note)
- `docs/reports/README.md` (Updated)

---

## 8. Verification Results

### Pre-refactoring Baseline
- `npm --prefix backend run test:db:migrate`: 4 migrations up to date (`flowpilot_ai_test`).
- `npm --prefix backend run test:unit`: 7 files, 62/62 passed.
- `npm --prefix backend run test:integration`: 9 files, 36/36 passed.
- `npm --prefix backend run typecheck`, `lint`, `build`: passed.
- `npm --prefix frontend run typecheck`, `build`, `test`: passed (8 files, 58/58 passed).

### Post-refactoring Verification
- `npm --prefix backend run typecheck`: passed.
- `npm --prefix backend run lint`: passed.
- `npm --prefix backend run build`: passed.
- `npm --prefix backend run test:architecture`: 1 file, 5/5 passed.
- `npm --prefix backend run test:unit`: 7 files, 62/62 passed.
- `npm --prefix backend run test:integration`: 9 files, 36/36 passed (PostgreSQL `flowpilot_ai_test`).
- `npm --prefix frontend run typecheck`, `build`, `test`: passed (8 files, 58/58 passed).

---

## 9. Acceptance Criteria

- **AC-01 → AC-30:** **PASSED** (Modular Monolith preserved, Feature-based Clean Architecture applied to `auth`, Domain/Application independent of frameworks, Ports & Adapters implemented, Composition Root in `auth.module.ts`, PostgreSQL schema/migrations & OpenAPI contracts unchanged, all unit/integration/architecture/frontend tests passed, all documentation & historical reports synchronized).

---

## 10. Known Issues & Next Task

- **Known Issues:** Các module Sprint 2 (`workspace`, `project`) vẫn đang dùng Layered Architecture cũ; sẽ được migrate theo từng sprint hoặc task refactor riêng khi chạm tới.
- **Next Task:** `TASK-02` — Task và My Tasks API (`docs/sprints/sprint-03-task-board/tasks/TASK-02-task-api.md`), triển khai theo chuẩn Feature-based Clean Architecture mới.

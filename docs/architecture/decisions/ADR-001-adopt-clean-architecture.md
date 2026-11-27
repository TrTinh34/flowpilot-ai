# ADR-001: Áp dụng Feature-based Clean Architecture cho Backend Modular Monolith

- **Status:** Accepted
- **Date:** 2026-11-27
- **Deciders:** Technical Lead / Solo Developer (FlowPilot AI)
- **Related Documents:** [System Design](../../04-System-Design.md), [Architecture Refactoring Report](../../reports/architecture/clean-architecture-refactoring.md)

---

## 1. Context

FlowPilot AI là nền tảng AI-powered Project Management và Team Collaboration được xây dựng theo **Modular Monolith** với **Feature-based Architecture**.

Trong giai đoạn đầu (Sprint 01 – Sprint 02 và đầu Sprint 03), backend được triển khai theo **Layered Architecture** bên trong mỗi feature module (`routes → controller → service → repository → prisma`). Cách tiếp cận này giúp khởi tạo nhanh các tính năng nền tảng (`auth`, `workspace`, `project`, `task` schema).

Tuy nhiên, khi codebase mở rộng sang Sprint 03+ (Task/Board concurrency, Collaboration, Notifications, Dashboard, Audit, AI Planning), đánh giá kiến trúc hiện tại cho thấy các vấn đề sau:

1. **Business logic phụ thuộc trực tiếp vào hạ tầng:** `auth.session.ts` gọi trực tiếp `prisma.$transaction`, `logger`, `auth.tokens.ts` (`jose`), và `refresh-token.repository.ts`. `auth.service.ts` phụ thuộc trực tiếp vào `auth.repository.ts` (Prisma) và `crypto.util.ts` (`bcryptjs`).
2. **Rò rỉ khái niệm HTTP và ORM:** `auth.service.ts` và `auth.session.ts` khởi tạo `AppError` kèm HTTP status code (`401`, `404`, `409`, `500`), làm trộn lẫn tầng nghiệp vụ với tầng HTTP presentation. `auth.repository.ts` trả về error `PrismaClientKnownRequestError` để tầng service kiểm tra.
3. **Middleware phụ thuộc trực tiếp vào implementation:** `src/middlewares/auth.middleware.ts` import trực tiếp `jose` (`errors.JOSEError`) và `verifyAccessToken` từ `modules/auth/auth.tokens.ts`.
4. **Unit test phải mock module-level internals:** Các unit test hiện tại phải dùng `vi.mock('../../src/config/prisma.js')` hoặc `vi.mock('../../src/modules/auth/auth.repository.js')` thay vì inject fake/stub qua constructor.
5. **Thiếu Composition Root rõ ràng:** Các controller và route import trực tiếp singleton service functions, gây khó khăn khi cần thay thế adapter hoặc kiểm thử độc lập từng Use Case.

---

## 2. Previous Architecture

- **Architecture Style:** Modular Monolith.
- **Code Organization:** Feature-based Architecture.
- **Backend Internal Architecture:** Layered Architecture (`Controller → Service → Repository → Prisma`).
- **Dependency Management:** Direct module imports, implicit singletons (`prisma`, `env`, `logger`).

---

## 3. Decision

Chuyển đổi kiến trúc nội bộ của backend sang **Feature-based Clean Architecture** bên trong **Modular Monolith** hiện có, áp dụng **Dependency Inversion Principle (DIP)**, **Constructor Injection**, và **Composition Root** (không dùng DI framework bên ngoài).

---

## 4. Target Architecture

- **Architecture Style:** Modular Monolith.
- **Code Organization:** Feature-based Architecture.
- **Backend Internal Architecture:** Clean Architecture với 4 tầng trong mỗi module:
  1. **Domain** (`domain/`): Entities, value objects, domain policies/helpers, domain errors (framework-independent TypeScript).
  2. **Application** (`application/`): Use Cases, Input/Output DTOs, Ports (interfaces cho repository, security, transaction, logger), Application errors.
  3. **Infrastructure** (`infrastructure/`): Prisma repositories, UnitOfWork (`prisma.$transaction`), bcrypt password hasher, jose JWT/refresh token service, Pino logger adapter.
  4. **Presentation** (`presentation/`): Express controllers, routes, Zod request schemas, error presenter (map Domain/Application errors → HTTP status codes), HTTP middlewares.
- **Dependency Rule:**
  - `Domain` không phụ thuộc vào `Application`, `Infrastructure`, `Presentation`, Express, Prisma, bcrypt, hay jose.
  - `Application` chỉ phụ thuộc vào `Domain` và các `Ports` của chính nó.
  - `Infrastructure` implement các `Ports` từ `Application` và có thể phụ thuộc vào `Domain` / `Application`.
  - `Presentation` chỉ phụ thuộc vào `Application` (Use Cases, DTOs) và `Domain` contracts/errors; không gọi Prisma hay concrete repositories.
  - **Composition Root** (`<module>.module.ts` và `app.ts`) là nơi duy nhất lắp ráp concrete Infrastructure adapters vào Use Cases và Controllers.

---

## 5. Alternatives Considered

| Alternative | Mô tả | Lý do chọn / loại bỏ |
|---|---|---|
| **A. Tiếp tục Layered Architecture** | Giữ nguyên `controller → service → repository` | Không giải quyết được coupling trực tiếp với Prisma/HTTP/jose trong tầng nghiệp vụ và khó test Use Case thuần túy khi module AI/Board/Outbox phức tạp hơn. |
| **B. Áp dụng chọn lọc một số nguyên tắc Clean Architecture** | Chỉ tách interface cho AI/Storage, giữ nguyên `auth` và các module khác | Tạo sự thiếu nhất quán giữa các module; module `auth` (nền tảng bảo mật) vẫn bị coupling chặt với Prisma và `AppError` HTTP codes. |
| **C. Feature-based Clean Architecture trong Modular Monolith (Selected)** | Chuẩn hóa 4 tầng + Ports + Constructor Injection + Composition Root cho từng feature module | Đạt tách biệt trách nhiệm rõ ràng, testability cao, giữ nguyên đơn giản vận hành của Modular Monolith, phù hợp cho solo developer. |
| **D. Tách sang Microservices** | Tách `auth`, `workspace`, `project`, `task`, `ai` thành các service riêng | Over-engineering cho giai đoạn MVP và solo developer; tăng mạnh chi phí vận hành, distributed transactions và network latency. |

---

## 6. Rationale

- **Modular Monolith + Clean Architecture** kết hợp tốt: Modular Monolith giữ ranh giới nghiệp vụ và triển khai đơn giản (1 backend app, 1 PostgreSQL DB), trong khi Clean Architecture bảo vệ business logic khỏi chi tiết kỹ thuật (Express, Prisma, JWT library, bcrypt).
- **Constructor Injection thủ công** tại Composition Root (`auth.module.ts`) đủ rõ ràng, type-safe 100%, không cần thêm DI container framework (như Inversify/tsyringe) hay decorators.
- **Giữ nguyên API & Database:** Không thay đổi OpenAPI contract, không sửa Prisma schema/migrations, không ảnh hưởng React frontend.

---

## 7. Consequences

### Positive Consequences
- Use Cases độc lập hoàn toàn với Express, Prisma, bcrypt, jose — có thể unit test nhanh bằng in-memory fakes/stubs không cần mock module internals.
- Ranh giới transaction (`AuthUnitOfWork`) và bảo mật (`PasswordHasher`, `TokenService`) được mô hình hóa tường minh qua Ports.
- Dễ dàng mở rộng các module tiếp theo (`task`, `board`, `collaboration`, `notification`, `ai`) theo cùng một khuôn mẫu chuẩn.
- Có thể kiểm tra tự động Dependency Rule qua architecture fitness tests.

### Negative Consequences
- Số lượng file trong mỗi module tăng lên (ports, adapters, use cases, presenters).
- Cần kỷ luật tuân thủ Dependency Rule khi phát triển tính năng mới (được hỗ trợ bởi ESLint/architecture fitness tests và `AGENTS.md`).
- Clean Architecture không tự động cải thiện runtime performance hay thay thế nhu cầu kiểm thử tích hợp với PostgreSQL thật.

---

## 8. Migration Strategy

Thực hiện migration từng bước (incremental migration) lấy module `auth` làm chuẩn mực đầu tiên:
1. Thiết lập Shared Kernel (`shared/domain/`, `shared/application/`, `shared/presentation/`).
2. Xây dựng tầng `domain/`, `application/` (ports, DTOs, use cases), `infrastructure/` (adapters), `presentation/` (controllers, routes, schemas, error presenter) cho module `auth`.
3. Tạo Composition Root `auth.module.ts` và tích hợp vào `src/routes/index.ts` và `src/middlewares/auth.middleware.ts`.
4. Chuyển đổi toàn bộ unit tests và integration tests sang cấu trúc mới, bổ sung architecture fitness tests.
5. Gỡ bỏ các file `auth` cũ sau khi mọi reference đã chuyển hoàn toàn.
6. Đồng bộ tài liệu kiến trúc, diagrams, Sprint/Task docs, historical reports, `AGENTS.md`, và `.kiro/`.

Các module Sprint 2 (`workspace`, `project`) giữ nguyên hoạt động ổn định trong phạm vi task này và sẽ áp dụng chuẩn Clean Architecture khi có task refactor riêng hoặc khi mở rộng.

---

## 9. Risks & Mitigation

| Risk | Impact | Mitigation |
|---|---|---|
| Phá vỡ hành vi transaction trong Refresh Token Rotation / Reuse Detection | High | Giữ nguyên `ReadCommitted` + `pg_advisory_xact_lock` trong `PrismaAuthUnitOfWork` & `PrismaRefreshTokenRepository`; kiểm chứng bằng toàn bộ PostgreSQL integration tests (`auth.session.postgres.test.ts`). |
| Thay đổi vô ý HTTP status code hoặc response shape | High | Giữ nguyên Zod schemas và map chính xác `DomainError` → `AppError` trong `auth-error.presenter.ts`; chạy lại toàn bộ Supertest integration & HTTP unit tests. |
| Tạo abstraction dư thừa (over-engineering) | Medium | Chỉ tạo các Ports thực sự được Use Cases sử dụng; không tạo `BaseRepository` hay `BaseService` chung chung. |

---

## 10. Verification Evidence

*(Cập nhật sau khi hoàn thành Phase 5 — Regression Verification)*

- Pre-refactoring baseline:
  - Backend unit tests: 7 files, 62/62 passed.
  - Backend integration tests: 9 files, 36/36 passed (PostgreSQL `flowpilot_ai_test`).
  - Backend typecheck, lint, build: passed.
  - Frontend typecheck, build, tests (8 files, 58/58): passed.
- Post-refactoring verification: xem [Architecture Refactoring Report](../../reports/architecture/clean-architecture-refactoring.md).

---

## 11. Future Architecture Guidelines

- Mọi module backend mới (`task`, `board`, `collaboration`, `notification`, `dashboard`, `audit`, `ai`) phải tổ chức theo 4 tầng Clean Architecture: `domain/`, `application/`, `infrastructure/`, `presentation/` + `<module>.module.ts`.
- Không import chéo vào nội bộ (`infrastructure/`, `domain/`) của module khác; giao tiếp qua public contract (`index.ts`) hoặc Application Ports.
- Luôn giữ `Prisma` và `Express` ngoài `domain/` và `application/`.

---
inclusion: auto
name: frontend-architecture
description: Frontend architecture, coding standards, component conventions, và design system cho FlowPilot AI
---

# Frontend Architecture — FlowPilot AI

## Kiến trúc tổng quan

Frontend áp dụng **Feature-based Architecture** kết hợp Layered Architecture. (Lưu ý: **Clean Architecture** là kiến trúc nội bộ của **backend** trong Modular Monolith; frontend giữ nguyên Feature-based Architecture.)

## Directory Responsibilities

| Directory | Responsibility |
|---|---|
| `src/app/` | App setup: providers, router, global store (Zustand) |
| `src/components/ui/` | shadcn/ui primitives và extensions |
| `src/components/common/` | Shared app-level components (ErrorBoundary, EmptyState, ErrorState, LoadingState) |
| `src/layouts/` | AuthLayout, AppShellLayout |
| `src/features/<name>/` | Business-specific: api/, components/, schemas/ (Zod), types/ |
| `src/pages/` | Route-level composition chỉ — không chứa logic; mọi page trong `AppRouter.tsx` phải nằm tại đây (`pages/task/TaskDetailPage.tsx`) |
| `src/hooks/` | Reusable React hooks |
| `src/services/` | Shared HTTP client infrastructure (api-client.ts) |
| `src/lib/` | Library config: env.ts, query-client.ts |
| `src/styles/` | Global CSS, design tokens (CSS custom properties) |
| `src/types/` | Shared TypeScript interfaces và types |
| `src/utils/` | Pure utility functions |

## State Management

- **TanStack Query** — server state (fetch, cache, loading, error)
- **Zustand** — shared client state: access token (in-memory), user session, UI state (sidebar)
- **React Hook Form + Zod** — form state và validation
- Không dùng hai state manager cùng loại

## Form & Validation

- React Hook Form + Zod cho tất cả forms
- Zod schema định nghĩa trong `features/<name>/schemas/`
- Không tạo Zod schema trùng lặp giữa features

## API Client

- `src/services/api-client.ts` — axios instance với `withCredentials: true`, `baseURL: VITE_API_BASE_URL`
- Feature API calls định nghĩa trong `features/<name>/api/<name>.api.ts`
- Không gọi axios trực tiếp trong components
- Error extraction qua `extractApiErrorMessage(error)`

## Component Standards

- Functional components, TypeScript strict
- Props interfaces được đặt tên `<ComponentName>Props`
- Không dùng `any` trừ khi có lý do kỹ thuật cụ thể, comment rõ
- shadcn/ui primitives làm nền tảng; extend thay vì duplicate
- Không đặt business logic trong generic UI components

## Design Tokens

Tokens định nghĩa trong `src/styles/index.css` dưới dạng CSS custom properties.

Màu brand:
- `--primary`: `#6366F1` (oklch tương đương)
- `--secondary`: `#8B5CF6`
- `--accent`: `#A78BFA` (AI features)

Dùng Tailwind utility classes tham chiếu tokens. Không hardcode màu hex trong components.

## Naming Conventions

- Components: `PascalCase.tsx`
- Hooks: `use<Name>.ts`, camelCase
- Utilities: `<name>.util.ts`
- Schemas: `<name>.schema.ts`
- Types: `<name>.types.ts`
- API: `<name>.api.ts`
- Pages: `<Name>Page.tsx`
- Layouts: `<Name>Layout.tsx`

## Anti-patterns

- Không gọi API trực tiếp trong components
- Không để business logic trong UI primitives
- Không dùng index.ts barrel re-exports trừ khi feature cần
- Không import circular
- Không localStorage cho tokens
- Không sử dụng placeholder thay cho label trong forms
- Không export Page component từ `features/` (luôn đặt tại `src/pages/`)
- Không để mock/demo fixture chạy hoặc rò rỉ vào production (`DEV && VITE_USE_MOCK_API === 'true'`)
- Hỗ trợ route-level code splitting (`React.lazy` + `Suspense`) trong `AppRouter.tsx` để giữ main bundle gọn

## Testing

- Vitest + React Testing Library cho components và hooks
- Playwright cho E2E (Sprint 6)
- Test files: `tests/` directory hoặc `*.test.tsx` cạnh source
- Chạy: `npm test` trong `frontend/`

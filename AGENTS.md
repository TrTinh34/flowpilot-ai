# Hướng dẫn cho Agent

<!-- postman-cli:installation:start -->
Postman CLI is installed on this device, and can be used for API Engineering work.
<!-- postman-cli:installation:end -->

## Trước khi bắt đầu Task

- Đọc tài liệu liên quan trong `docs/` và [Product Backlog](docs/07-Backlog-Roadmap.md) để xác định phạm vi.
- Đọc AGENTS.md, [Sprint Index](docs/sprints/README.md), Sprint README và Task File tương ứng.
- Đọc [Reports Index](docs/reports/README.md) và các báo cáo liên quan trực tiếp.
- Đối chiếu báo cáo cũ với source code thực tế trước khi dựa vào kết quả đã ghi.
- Kiểm tra dependencies và tiêu chí nghiệm thu. Khi bắt đầu, cập nhật trạng thái trong Sprint Backlog nếu Task thuộc Sprint.

## Trong khi triển khai

- Tuân thủ phạm vi Task và tiêu chí nghiệm thu đã thống nhất.
- Ghi lại blockers và quyết định kỹ thuật. Thống nhất thay đổi phạm vi hoặc tiêu chí trước khi thực hiện.

## Sau khi hoàn thành Task

- Chạy verification commands, đánh giá từng tiêu chí nghiệm thu và ghi rõ phần chưa được kiểm chứng.
- Tạo hoặc cập nhật báo cáo trong `docs/reports/` theo [REPORT-TEMPLATE.md](docs/reports/REPORT-TEMPLATE.md).
- Cập nhật trạng thái Task tại Sprint Backlog, đồng bộ tổng hợp tiến độ Sprint, Reports Index và các mốc liên quan trong Product Backlog.
- Tạo một commit cho mỗi Task đã hoàn thành và kiểm chứng. Ghi commit và đường dẫn báo cáo trong phản hồi cuối.
- Dừng và chờ Developer Review, trừ khi Developer đã giao một chuỗi Task. Chỉ push khi được giao.

## Khi bắt đầu Sprint mới

- Chỉ bắt đầu khi được giao. Xác minh Sprint trước đã đạt Definition of Done hoặc có quyết định chuyển Sprint rõ ràng.
- Tạo Sprint directory, Sprint README và Task Files từ Product Backlog bằng template. Xác định dependencies và tiêu chí nghiệm thu.

## Chất lượng báo cáo

- Mỗi Task có một báo cáo chính. Cập nhật báo cáo đó khi bổ sung hoặc sửa Task, kể cả các sửa lỗi nhỏ.
- Tóm tắt thay đổi và bằng chứng. Không sao chép toàn bộ source code hay nội dung cuộc trò chuyện.
- Không lưu API key, password, token, thông tin kết nối database hoặc thông tin nhạy cảm.
- Dùng đường dẫn tương đối. Không ghi đường dẫn tuyệt đối trên máy.
- Chỉ đánh dấu `PASSED` khi đã kiểm chứng. Dùng `NOT VERIFIED` hoặc `UNKNOWN` cho thông tin lịch sử thiếu bằng chứng.
- Viết tiếng Việt, giữ nguyên thuật ngữ kỹ thuật tiếng Anh. Ưu tiên nội dung ngắn gọn và chính xác.

## Kiến trúc Frontend (Feature-based Architecture)

- Tổ chức code theo feature trong `frontend/src/features/<feature>/` (api, components, schemas, types, hooks).
- Shared components genuinely reusable đặt trong `components/ui/` (shadcn primitives) và `components/common/`.
- Pages (`pages/`) chỉ compose layouts và feature components — không chứa business logic hay API calls.
- Routing: React Router v7, `app/router/AppRouter.tsx`. Protected routes dùng `ProtectedRoute`, public-only dùng `PublicOnlyRoute`.
- Server state: TanStack Query. Client state: Zustand (auth.store, ui.store). Form state: React Hook Form + Zod.
- API calls: qua `services/api-client.ts` (axios, `withCredentials: true`). Feature API functions trong `features/<name>/api/`.
- Access token: lưu in-memory trong Zustand. Không bao giờ lưu vào localStorage. Refresh token là HttpOnly cookie — không đọc từ JS.
- Design system: CSS custom properties trong `styles/index.css`. Tailwind v4 `@theme` extension. Không hardcode hex color trong components.
- Mock API: check `import.meta.env.VITE_USE_MOCK_API`. Mock fixtures trong `mocks/fixtures/`. Không bao giờ enable mock trong production.
- Trước khi implement UI được giao, bắt buộc đọc:
  1. `.agents/skills/ui-ux-pro-max/SKILL.md` (áp dụng `--design-system`, `--domain`, `--stack` khi thiết kế/sửa UI — không áp dụng cho task backend-only).
  2. Design System đã duyệt ([Design System](docs/design/frontend/design-system.md)), [Component Inventory](docs/design/frontend/component-inventory.md) và [Screen Specs](docs/design/frontend/screen-specifications.md).
  3. Task Spec & source code hiện có của feature tương ứng.
- Tái sử dụng shared UI trong `components/ui/` và `components/common/` (`Select`, `Textarea`, `Avatar`, `StatusBadge`, `PriorityBadge`, `ConfirmDialog`, `PageHeader`, `LoadingState`, `EmptyState`, `ErrorState`, `FormErrorBanner`); không viết CSS class trùng lặp, không dùng `border` trơn (luôn dùng `border-border` / `border-input`), không dùng `rounded-xl` cho card (`rounded-[var(--radius-md)]`), không dùng emoji làm icon.
- Giữ API contracts, auth security behavior và architectural boundaries. Giữ API thật và hiển thị lỗi thật, chỉ dùng Demo với feature được phép (`DEV && VITE_USE_MOCK_API === 'true'`). Kiểm chứng giao diện render thực tế, keyboard và responsive (`360–1920px`) theo Task Spec, ghi evidence trong Development Report và cập nhật trạng thái Task dựa trên bằng chứng đã xác minh.
- Viết ít nhất render + interaction + error state tests cho mỗi component mới (Vitest + RTL).
- Chạy `npm --prefix frontend run typecheck`, `lint`, `test`, `build` trước khi đóng Task.
- Reports frontend: `docs/reports/frontend/`.



- Tổ chức code backend theo business feature bên trong **Modular Monolith** (`backend/src/modules/<feature>/`).
- Tuân thủ **Clean Architecture Dependency Rule** với 4 tầng: `domain/`, `application/`, `infrastructure/`, `presentation/`.
- Giữ `domain/` độc lập hoàn toàn với framework ngoài (không import Express, Prisma, bcrypt, jose, Pino, hay `process.env`).
- Giữ `application/` (Use Cases, DTOs, Ports) độc lập với concrete infrastructure và HTTP transport (không trả về HTTP status codes, không đọc cookies, không trả về generated Prisma models).
- Định nghĩa **Ports** (interfaces) trong `application/ports/` và implement trong `infrastructure/`.
- Giữ các concern HTTP (Express routes, controllers, Zod schemas, cookie handling, error-to-HTTP mapping) trong `presentation/`.
- Sử dụng **Constructor Injection** tường minh và lắp ráp dependencies tại **Composition Root** (`<module>.module.ts`, `app.ts`); không dùng DI container framework hay service locator.
- Bảo vệ **module boundaries**: không deep-import vào nội bộ (`domain/`, `application/`, `infrastructure/`, `presentation/`) của module khác; giao tiếp qua `index.ts` hoặc Application Ports.
- Giữ quyền sở hữu transaction tường minh qua UnitOfWork/transaction port; không để repository calls trong transaction chạy bằng global `prisma` client.
- Không tạo abstraction dư thừa (`BaseRepository`, `BaseService`) khi chưa có nhu cầu thực tế.
- Viết unit tests cho Use Cases (dùng fake Ports), integration tests cho Infrastructure & API trên PostgreSQL test DB, và chạy architecture fitness tests (`npm --prefix backend run test:architecture`).

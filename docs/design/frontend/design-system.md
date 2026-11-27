# Design System · FlowPilot AI (V2 Proposed)

> **Trạng thái:** `PROPOSED (Pending Developer Approval)` — Cập nhật từ Baseline V1 (Sprint 06) dựa trên kết quả kiểm toán `frontend-reaudit-report.md` và khuyến nghị từ `ui-ux-pro-max` Skill.
> **Nguồn thực thi duy nhất:** `frontend/src/styles/index.css` (CSS Custom Properties + Tailwind v4 `@theme static` / `@theme inline`). Không tạo Design System song song.

---

## 1. Triết lý & Định hướng (UI/UX Pro Max Evaluation)

- **Product Fit:** AI-powered B2B SaaS cho đội ngũ phát triển phần mềm và quản lý dự án (desktop-first responsive web app).
- **Cảm hứng tham chiếu:** Linear (navigation gọn, mật độ cao), Vercel Dashboard (typography rõ, border 1px sắc nét), Notion (grouping workspace), ClickUp/Asana (status/priority workflow).
- **Đối chiếu khuyến nghị `ui-ux-pro-max` với Brand Identity hiện có:**
  - *Giữ lại Brand FlowPilot:* Giữ Indigo (`#6366F1` brand, `#4F46E5` primary action) và Violet (`#8B5CF6` / `#6D28D9` AI accent) trên nền Slate sáng (`#F8FAFC` / `#FFFFFF`), từ chối bảng màu generic Blue/Orange (`#2563EB` / `#EA580C`) mà `ui-ux-pro-max` gợi ý mặc định để bảo toàn nhận diện sản phẩm.
  - *Điều chỉnh Style:* Chọn **Minimalism & Flat SaaS** kết hợp elevation nhẹ (`shadow-xs`, `shadow-popover`, `shadow-dialog`) thay vì Glassmorphism (`backdrop-blur`), tránh mất độ tương phản và hiệu ứng rườm rà trên bảng/Kanban mật độ cao.
  - *Giữ Font Family:* Giữ **Inter** (UI) + **JetBrains Mono** (IDs/code) thay cho Plus Jakarta Sans vì phù hợp với developer productivity SaaS và đã tối ưu trong `index.html`; bổ sung bắt buộc `tabular-nums` cho mọi số đếm, ngày tháng, kích thước tệp và KPI.
  - *Áp dụng từ Skill:* Mật độ `density 7/10` (controls 36px/32px thay cho 44px quá khổ ở desktop), semantic status/priority tokens có icon+text đi kèm, z-index scale chuẩn, `scroll-padding-top` chống che focus, và `React.lazy` route splitting.

---

## 2. So sánh V1 (Sprint 06) → V2 (Proposed)

| Hạng mục | V1 Baseline (`REDESIGN-02`) | V2 Proposed (`REFINE-03`) | Lý do thay đổi |
|---|---|---|---|
| **Control Height** | `h-11` (44px) mặc định cho mọi Button/Input | Desktop default `36px` (`h-9`), compact `32px` (`h-8`), comfortable `40px` (`h-10` cho Auth/Hero CTA). Mobile touch target đạt `>= 44px` hoặc hit-area mở rộng ở icon/drawer controls. | `h-11` và `select` cao làm card/filter bị thô trên desktop; đưa về đúng spec 32/36/40px của `ui-design-system.md`. |
| **Border Radius** | Khai báo `--radius-md: 8px`, `--radius-lg: 12px` nhưng code dùng lẫn `rounded`, `rounded-lg`, `rounded-xl` (12px) cho cards | Quy chuẩn cứng: `6px` (`--radius`) cho inputs/buttons/selects, `8px` (`--radius-md`) cho cards/columns/panels, `12px` (`--radius-lg`) **chỉ** cho dialogs/popovers. Cấm `rounded-xl` trên cards. | Loại bỏ sự thiếu nhất quán và cảm giác bo góc quá khổ giữa `ProjectCard` (`12px`), `Card` (`8px`), `TaskForm` (`4px`). |
| **Border Color** | Chỉ có `--border` và `--control-border`, nhiều file dùng class `border` trơn | Quy ước **cấm** dùng `border` trơn (Tailwind v4 render `currentColor` đen `#0f172a`). Bắt buộc `border-border` cho surface và `border-input` cho form controls. | Sửa dứt điểm lỗi viền đen ở `TaskDetailDrawer`, `TaskForm`, `SubtaskList`. |
| **Status & Priority Tokens** | Chỉ có `Badge` (`neutral` / `success`) | Thêm đầy đủ semantic tokens cho 4 Task Status (`TODO`, `IN_PROGRESS`, `IN_REVIEW`, `DONE`) và 4 Priority (`LOW`, `MEDIUM`, `HIGH`, `URGENT`) ở cả Light và Dark. | Giúp quét bảng/list/Kanban tức thì mà không dựa vào chữ thô `"Priority: High"`. |
| **Z-index Scale** | Hardcode rải rác `z-10`, `z-40`, `z-50`, `z-[60]`, `z-[70]` | Chuẩn hóa 6 tầng token: `sticky: 10`, `dropdown: 20`, `drawer: 40`, `modal: 50`, `popover: 60`, `skip-link: 70`. | Tránh xung đột layer giữa dropdown, drawer, modal và skip-link. |
| **Shell Tokens** | Khai báo `--topbar-height: 56px` và `--sidebar-bg` nhưng `AppShellLayout` dùng `h-16` (64px) và `bg-card` | Áp dụng `--topbar-height: 56px` (`h-14`), `--sidebar-bg`, `--sidebar-width: 240px`, `--sidebar-rail-width: 64px`, thêm `scroll-padding-top: var(--topbar-height)` trên vùng scroll chính. | Khớp thiết kế shell gọn hơn (Linear-inspired) và đạt WCAG 2.2 AA *Focus Not Obscured*. |

---

## 3. Hệ thống Token V2

### 3.1 Brand & Surfaces (Light `:root` / Dark `.dark`)

| Vai trò | CSS Token | Light Value | Dark Value | Contrast / Ghi chú |
|---|---|---|---|---|
| Brand Primary | `--color-primary` | `#6366F1` | `#818CF8` | Nhận diện thương hiệu, icon accent (không dùng làm nền nút chữ trắng) |
| Primary Action | `--action-primary` / `--action-primary-hover` / `--action-primary-active` | `#4F46E5` / `#4338CA` / `#3730A3` | `#6366F1` / `#818CF8` / `#4F46E5` | Chữ `#FFFFFF` trên `#4F46E5` đạt ~6.29:1 (AA) |
| AI Accent / Text | `--color-accent-ai` / `--ai-text` | `#8B5CF6` / `#6D28D9` | `#A78BFA` / `#C4B5FD` | Dùng riêng cho AI Planner / AI badges (~7.10:1 trên trắng) |
| Canvas / Surface / Muted | `--background` / `--surface` / `--surface-secondary` | `#F8FAFC` / `#FFFFFF` / `#F1F5F9` | `#09090B` / `#18181B` / `#111113` | Phân tầng canvas → card → inset |
| Borders | `--border` / `--control-border` | `#E2E8F0` / `#64748B` | `#27272A` / `#71717A` | Surface border 1px vs Control border >= 3:1 |
| Text | `--foreground` / `--foreground-secondary` / `--foreground-muted` | `#0F172A` / `#475569` / `#64748B` | `#FAFAFA` / `#A1A1AA` / `#71717A` | Lưu ý nâng `--foreground-muted` Light lên `#64748B` khi dùng làm text phụ để tiệm cận 4.5:1 (giữ `#94A3B8` chỉ cho icon trang trí/placeholder). |
| Focus Ring | `--focus-ring` | `#4F46E5` (2px, offset 2px) | `#A5B4FC` | Hiển thị rõ qua `:focus-visible` |

### 3.2 Semantic, Task Status & Priority Tokens

| Nhóm | Token Key | Light Text / Surface / Border | Dark Text / Surface / Border | Biểu tượng đi kèm (`lucide-react`) |
|---|---|---|---|---|
| **Success / Done** | `success` / `status-done` | `#166534` / `#DCFCE7` / `#BBF7D0` | `#86EFAC` / `#052E16` / `#166534` | `CheckCircle2` |
| **Info / In Progress** | `info` / `status-progress` | `#1D4ED8` / `#DBEAFE` / `#BFDBFE` | `#93C5FD` / `#0C1A2E` / `#1E40AF` | `CircleDot` |
| **Warning / In Review** | `warning` / `status-review` | `#92400E` / `#FEF3C7` / `#FDE68A` | `#FCD34D` / `#1C1407` / `#92400E` | `Clock` / `Eye` |
| **Neutral / To Do** | `neutral` / `status-todo` | `#475569` / `#F1F5F9` / `#E2E8F0` | `#A1A1AA` / `#27272A` / `#3F3F46` | `Circle` |
| **Danger / Urgent** | `error` / `priority-urgent` | `#B91C1C` / `#FEE2E2` / `#FECACA` | `#FCA5A5` / `#1C0A0A` / `#991B1B` | `AlertOctagon` / `Flame` |
| **Priority High** | `priority-high` | `#C2410C` / `#FFEDD5` / `#FED7AA` | `#FDBA74` / `#271206` / `#9A3412` | `ArrowUp` |
| **Priority Medium** | `priority-medium` | `#92400E` / `#FEF3C7` / `#FDE68A` | `#FCD34D` / `#1C1407` / `#92400E` | `Minus` |
| **Priority Low** | `priority-low` | `#475569` / `#F1F5F9` / `#E2E8F0` | `#A1A1AA` / `#27272A` / `#3F3F46` | `ArrowDown` |

> **Quy tắc WCAG (`color-not-only`):** Mọi status và priority badge bắt buộc hiển thị text nhãn (`To do`, `In progress`, `In review`, `Done`; `Urgent`, `High`, `Medium`, `Low`) cùng icon — không chỉ phân biệt bằng màu.

---

## 4. Typography, Spacing & Layout Grid

- **Font:** `Inter` (body/heading) + `JetBrains Mono` (code/IDs).
- **Scale:**
  - Page Title (`h1`): `28px / 36px` (`1.75rem / 2.25rem`), weight `600`, tracking `-0.015em`.
  - Section Title (`h2`): `18px–20px / 28px`, weight `600`, tracking `-0.01em`.
  - Card / Item Title (`h3` / row title): `15px / 22px`, weight `500–600`.
  - UI Body / Control: `14px / 20px`, weight `400–500`.
  - Metadata / Caption: `12px / 16px`, weight `400–500`, `tabular-nums` cho ngày/số.
- **Spacing (4px base grid):** `4, 8, 12, 16, 24, 32, 48px`.
  - Page gutter (`--page-gutter`): `16px` (`< 768px`), `24px` (`768px–1279px`), `32px` (`>= 1280px`).
  - Card padding chuẩn: `16px` (`p-4`) cho danh sách/Kanban/metrics, `20px–24px` cho form panels.
- **Content Width Rules:**
  - **Workspace-wide (`w-full min-w-0`):** Dashboard, Projects, Project Settings, Workspace Settings, My Tasks, Project Tasks, Kanban Board, Task Detail.
  - **Constrained reading width:** Notifications (`max-w-[820px]`), Profile & Settings (`max-w-[760px]`), Auth form (`max-w-[420px]`), Invite Accept (`max-w-lg`).

---

## 5. Responsive, Motion & Accessibility Contract

- **Breakpoints:** `360px` / `390px` (mobile), `768px` (`md`), `1024px` (`lg` — chuyển drawer sang sidebar), `1280px` (`xl`), `1440px` / `1920px`.
- **No horizontal document scroll:** `scrollWidth <= viewport + 1px` trên mọi màn (Kanban cuộn ngang nội bộ vùng board).
- **Motion:** `--duration-ui: 150ms`, `--ease-ui: ease-out`, chỉ animate `opacity`, `color`, `transform`. Bắt buộc `@media (prefers-reduced-motion: reduce)` vô hiệu hóa transition/pulse.
- **Accessibility (WCAG 2.2 AA):**
  - Một `<main id="main-content">` và một `<h1>` mỗi màn.
  - Mọi interactive element dùng `<button>` / `<a>` / Radix primitive có `cursor-pointer` (hoặc default pointer phù hợp) và visible `:focus-visible`.
  - Keyboard alternative cho drag-and-drop (Kanban `<select>` + `ArrowUp`/`ArrowDown`).
  - `scroll-padding-top: var(--topbar-height)` để tránh sticky header che focus.
  - Mọi form input có `<label htmlFor>` hiển thị rõ, error dưới trường kèm `aria-describedby` + `FormErrorBanner` có `role="alert"` và focus khi submit API lỗi.

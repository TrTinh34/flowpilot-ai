# Design System · Sprint 06

Mở rộng [Design System hiện tại](../02-Design-System.md). Nguồn thực thi là `frontend/src/styles/index.css`, nối CSS variables vào Tailwind `@theme inline`. Light là theme ưu tiên. Các alias Dark hiện có tiếp tục dùng theo class `.dark`.

| Vai trò | Token | Giá trị |
|---|---|---|
| Canvas, surface, inset | `--background`, `--surface`, `--surface-secondary` | #F8FAFC, #FFFFFF, #F1F5F9 |
| Text chính, phụ | `--foreground`, `--foreground-secondary` | #0F172A, #475569 |
| Divider, actionable border | `--border`, `--control-border` | #E2E8F0, #64748B |
| Brand, nút có chữ trắng, hover, active | `--color-primary`, `--action-primary`, `--action-primary-hover`, `--action-primary-active` | #6366F1, #4F46E5, #4338CA, #3730A3 |
| AI accent, AI text | `--color-accent-ai`, `--ai-text` | #8B5CF6, #6D28D9 |
| Semantic foreground | `--success-text`, `--warning-text`, `--color-error-text`, `--info-text` | #166534, #92400E, #B91C1C, #1D4ED8 |
| Semantic surface | success / warning / danger / info | #DCFCE7 / #FEF3C7 / #FEE2E2 / #DBEAFE |
| Focus | `--focus-ring` | #4F46E5, outline 2px, offset 2px |

Contrast mục tiêu 4.5:1 chữ thường, 3:1 chữ lớn và thành phần phi văn bản theo [WCAG 2.2](https://www.w3.org/TR/WCAG22/). Primary trắng trên #4F46E5 khoảng 6.3:1, chữ phụ trên trắng khoảng 7.6:1. #6366F1 trên trắng khoảng 4.47:1, dành cho nhận diện và accent; đo lại các trạng thái trên UI render.

Font Inter với system sans fallback nếu Inter chưa được phục vụ. Scale px/line-height 12/16 metadata, 14/20 UI, 16/24 body, 20/28 section, 28/36 page. Trọng lượng 400/500/600/700. Spacing 4, 8, 12, 16, 24, 32, 48px; gutters 16/24/32. Radius 6 input, 8 card, 12 overlay. Border 1px; shadow nhẹ cho popover, mạnh hơn cho dialog. Hover đổi background, active có indicator và label; disabled hiển thị rõ, action pending khóa thao tác lặp. Transition 120–180ms, bỏ motion không cần thiết dưới `prefers-reduced-motion`.

Breakpoints 640, 768, 1024, 1280, 1536px. Dưới 1024 dùng nav drawer. Kiểm tra 360/390/768/1024/1280/1440/1920. Mục tiêu hit area 44px cho mobile controls, tối thiểu 24px hoặc đáp ứng ngoại lệ WCAG. Semantic trạng thái dùng label/icon bên cạnh màu.

| Caller | Alias và utility |
|---|---|
| Button | `bg-action`, `text-action-foreground`, `text-action-link`, `bg-danger-action` |
| Input | `border-input` → `--control-border`, `bg-card` → `--surface`, `text-muted-foreground` cho placeholder |
| Card, Tabs | `bg-card`, `bg-muted`, `text-foreground`, `text-muted-foreground` |
| Keyboard focus | `outline-ring` → `--focus-ring`; viền và offset 2px |
| Workspace layout ở các task sau | `px-page-gutter` → 16px mặc định, 24px từ 768px, 32px từ 1280px ở cỡ chữ gốc 16px |

# 01 — Design Direction

## Product Personality

FlowPilot AI là một **premium commercial SaaS** cho software development teams. Hình ảnh trực quan phải truyền tải: chuyên nghiệp, hiện đại, tập trung vào năng suất.

**3 từ khóa định hình:** Minimalist. Productive. Trustworthy.

## Design Principles

1. **Compact nhưng readable** — mật độ thông tin cao (như Linear), nhưng luôn giữ line-height và spacing đủ để đọc dễ.
2. **Subtle borders, không shadow heavy** — phân tách bằng 1px border; chỉ dùng shadow-xs cho cards nổi lên khỏi background.
3. **Restrained color** — indigo chỉ xuất hiện ở CTA, active states, links. Không tô màu lớn.
4. **Violet là màu của AI** — các tính năng AI dùng accent `#A78BFA` để phân biệt với các phần còn lại của UI.
5. **Consistency over cleverness** — cùng một loại element phải render giống nhau ở mọi màn hình.
6. **Mobile-first accessibility** — mọi layout phải work từ 360px (theo NFR-05).

## Visual Inspirations (không copy)

- **Linear**: compact sidebar, issue density, keyboard-first UX
- **Vercel**: typography scale, spacing rhythm, dashboard layout
- **Notion**: workspace organization, page hierarchy
- **ClickUp**: PM feature completeness
- **Jira**: task workflow structure

## Brand Identity

**Name:** FlowPilot AI  
**Tagline:** Plan smarter. Build together.

**Logo concept:** 3 đường chéo song song tạo cảm giác "flow" và forward movement; kết hợp một node kết nối đại diện collaboration. Thuần geometric, monochrome (`currentColor`), hoạt động ở mọi kích thước từ 16px (favicon) đến 64px (auth hero).

**Logo specifications:**
- Light theme: indigo `#6366F1`
- Dark theme: `#A5B4FC` (indigo-300) để đạt contrast
- Trên gradient indigo (auth hero panel): white

## Brand Colors

| Token | Hex | Use |
|---|---|---|
| Primary | `#6366F1` | CTA buttons, active nav, links |
| Primary Hover | `#4F46E5` | Hover state của primary |
| Secondary | `#8B5CF6` | Purple gradient end, secondary emphasis |
| AI Accent | `#A78BFA` | AI features (Planner, AI suggestions) |
| Success | `#22C55E` | Task done, confirmations |
| Warning | `#F59E0B` | Due date sắp tới, warnings |
| Error | `#EF4444` (bg) / `#DC2626` (text) | Errors, destructive |
| Info | `#3B82F6` | Info badges, tooltips |

## Khác biệt hóa so với generic admin dashboard

FlowPilot AI **không** trông giống Bootstrap admin template. Cách tránh:

- Sidebar có organization: logo + workspace switcher ở top, grouped nav items, user profile ở bottom
- Page content có clear hierarchy: Page Title + description + actions row
- Cards dùng subtle border thay vì shadowed white boxes
- Kanban columns có header compact với count badges
- Font Inter với tracking tight cho headings

## MVP vs Future

**MVP (Sprint 1):** Auth screens chỉ. Login, Register, error states.  
**Sprint 2+:** App shell, workspace, project, task management, dashboard.  
**Sprint 5:** AI Planner với violet accent.

Design docs cho Sprint 2+ features nằm ở mức **direction**, chưa phải detailed spec. Mỗi Sprint sẽ detail riêng khi bắt đầu.

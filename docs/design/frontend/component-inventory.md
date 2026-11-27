# Shared Component Inventory

| Nhóm | Hiện trạng | Việc cần làm |
|---|---|---|
| Button / Icon Button | `ui/button.tsx` có variants và CVA; bell, nav và uploads có button riêng | Primary/secondary/ghost/danger, sizes 32/36/44, pending và icon label |
| Input, Label, Textarea, Select, Checkbox, Radio, Switch | Input/Label sẵn có, native controls rải trong TaskForm/Projects/Comments | Chuẩn hóa label, description, aria-invalid, keyboard; chỉ tạo variant dùng thực tế |
| Card, Avatar, Avatar Group, Badge | Card sẵn có, avatar initials lặp ở Shell, Profile, Workspace | Shared initials/fallback, semantic role, status và priority badge |
| Table, Data Table, Search, Filters, Pagination | List và pager từng màn hình | Table semantic, compact rows, mobile stacked rows, page-aware filters và pager |
| Menu, Context Menu, Tooltip, Popover | Shell có menu riêng, Radix đã cài | Dùng primitives, click outside, Escape, focus return, không giấu thông tin quan trọng trong tooltip |
| Dialog, Drawer, Confirmation, Tabs | Tabs đã dùng ở Task Detail; create forms inline | Overlay dùng Radix, title/description, focus trap và return, confirm cho hành động destructive được hỗ trợ |
| Breadcrumb, Page Header, Section Header, Stat Card | Dashboard và pages mô phỏng riêng | Dùng cho route context, heading một cấp, slots cho actions và content |
| Date Picker, Progress, Skeleton, Toast, Empty, Error | Native date, progress/ad hoc status | Dùng native date trước; progress có label; skeleton cùng kích thước; empty CTA theo quyền; retry và lỗi validation theo trường |

Size/contrast ở [Design System](design-system.md). Shared primitive đặt trong `components/ui`, composition dùng chung đặt `components/common`, card có business rules ở feature. Giữ API, state và data mapping ở feature. Chỉ hợp nhất sau khi kiểm tra caller và snapshots hiện tại.

## Component đã dùng trong REDESIGN-03

| Component | Caller | Quy ước |
|---|---|---|
| `PageHeader` | Projects, My Tasks, Project Tasks | Một H1, action slot có thể xuống dòng |
| `LoadingState`, `EmptyState`, `ErrorState` | Projects, My Tasks, Project Tasks | Skeleton có nhãn status. Empty có heading và action tùy quyền. Error dùng alert và nhận callback Retry |
| `Pagination` | Projects, My Tasks, Project Tasks | Nhận page/hasNext từ caller, ẩn khi trang đầu không có bước kế tiếp |
| `FieldLabel` | Create Project và Task Form | Label liên kết control bằng ID |
| `Dialog` | Create Project | Radix modal, có title/description, giữ và trả focus. Busy khóa đóng và submit theo caller |
| `Badge` | Project status | Luôn có chữ Active hoặc Archived bên cạnh màu |

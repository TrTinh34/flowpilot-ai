# Visual Acceptance & Testing Strategy

| Gate | Bằng chứng cần ghi |
|---|---|
| Layout | Screenshot trước/sau mỗi route ở 390 và 1440; 1920 cho workspace rộng. Đo root scrollWidth ≤ viewport + 1px tại 360/390/768/1024/1280/1440/1920, ngoại trừ scroll nội bộ đã thiết kế. |
| Hierarchy | Cùng gutter trong workspace views, một H1 và một main, actions có nhãn và quyền, heading chính 28/36, reading widths theo spec. |
| States | Loading, empty và error kiểm tra riêng; Retry gọi lại API thật, disabled chống submit lặp; success chỉ sau thao tác xác nhận; 401/403/404/409 có xử lý phù hợp. |
| Accessibility | WCAG 2.2 AA mục tiêu. Keyboard đi hết luồng, focus nhìn thấy và không bị che, dialog trap/return, 4.5:1 chữ thường, 3:1 controls, label và trạng thái không chỉ dựa màu, kiểm tra 200% zoom và reduced motion. |
| Integration | Login/Register/refresh/logout, direct routes, workspace switch, task/list/board conflict, collaboration upload/download. Network đối chiếu request, status và mode. Debug bằng request ID đã khử PII. |
| Demo | Dev flag off/on, không có fallback khi API thật lỗi, production không phục vụ fixture, notification count chung, AI confirm demo không tạo task thật. |
| Automation | `npm --prefix frontend run typecheck`, `lint`, `format`, `test`, `build`; RTL render/interaction/error; browser smoke và visual diff nếu runner sẵn có. Backend regression khi corrective/integration cần. |
| Nghiệm thu | Không còn lỗi P0/P1 mở trong phạm vi được duyệt, developer review visual evidence, báo cáo từng task và CI nếu đã được phép push. |

Manual fallback: chạy dev frontend/backend theo README, đăng nhập bằng tài khoản test được cấp, mở đúng route trong [inventory](../../design/frontend/screen-inventory.md), dùng DevTools device toolbar cho widths trên. Dùng Tab/Shift+Tab/Enter/Space/Escape, zoom 200%, kiểm tra Network và lưu ảnh đã bỏ thông tin tài khoản. Đánh dấu NOT VERIFIED cho bước chưa thực hiện. [WCAG 2.2](https://www.w3.org/TR/WCAG22/)

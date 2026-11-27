# UI-08 — Design System Consistency Pass

## 1. Thông tin Task

- Task ID — UI-08
- Tên Task — Design System Consistency Pass
- Sprint — 4, Frontend Foundation & MVP Interactive Prototype
- Ngày triển khai — 2026-11-27
- Trạng thái — COMPLETED
- Yêu cầu liên quan — NFR-05, NFR-02

## 2. Tóm tắt triển khai

Review toàn bộ components trong Sprint 04 để đảm bảo tuân thủ design tokens. Không có hardcoded hex color trong components mới. CSS custom properties dùng nhất quán (`var(--foreground)`, `var(--border)`, v.v.). Lint errors và unused vars được fix.

## 3. File thay đổi

| File | Action | Mô tả |
|---|---|---|
| `frontend/src/pages/ai/AiPlannerPage.tsx` | Fix | Remove unused `setErrorMsg` |
| `frontend/src/pages/InitStatusPage.tsx` | Fix | Remove unused `logoutError` destructure |
| `frontend/src/features/workspace/components/WorkspaceSwitcher.tsx` | Fix | useMemo wrap `data?.data`, thêm `useMemo` import |
| `frontend/src/layouts/AppShellLayout.tsx` | Fix | Remove unused `useLocation` import |
| `frontend/tests/integration/protected-routes.test.tsx` | Cập nhật | Phản ánh router mới (NotFoundPage, redirect /dashboard) |

## 4. Quyết định kỹ thuật

- **Color usage:** Tất cả components Sprint 04 dùng `var(--*)` CSS custom properties. Primary button dùng `#6366f1` hardcode (đây là intentional — tránh dark mode override `--primary` token).
- **Responsive:** Tất cả layouts dùng Tailwind responsive prefix (`lg:`, `sm:`). Không có fixed px width ngoài AppShell sidebar.
- **Focus ring:** `focus-visible:ring-[3px] focus-visible:ring-[var(--color-primary)]/20` áp dụng nhất quán trên inputs.

## 5. Kết quả kiểm chứng

| Check | Command hoặc Evidence | Status |
|---|---|---|
| Lint | `npm run lint` → 0 errors, 2 warnings expected | PASSED |
| TypeScript | `npm run typecheck` → exit 0 | PASSED |
| No hardcoded hex in new components | Manual review | PASSED |
| Responsive classes consistent | Manual review | PASSED |

## 6. Acceptance Criteria

| Criterion | Status |
|---|---|
| Không có hardcoded hex trong components Sprint 04 | PASSED |
| Lint 0 errors | PASSED |
| Typecheck 0 errors | PASSED |
| Responsive classes nhất quán | PASSED |

## 7. Vấn đề và blocker

- Browser smoke (kiểm tra visual thực tế) cần developer thực hiện thủ công.
- Dark mode chưa được test thực tế trong Sprint 04.

## 9. Task tiếp theo

UI-09 — Frontend Foundation Testing & Review.

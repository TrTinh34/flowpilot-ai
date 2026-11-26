# 05 — Component Guidelines

## Component Hierarchy

```
1. shadcn/ui primitives      ← base, do NOT modify directly
      └─ src/components/ui/  ← extend or re-export với custom props nếu cần

2. Shared app components     ← src/components/common/
      ├─ ErrorBoundary, EmptyState, ErrorState, LoadingState (EXISTS)
      └─ Logo, FormErrorBanner (AUTH-08/09)

3. Feature components        ← src/features/<name>/components/
      └─ auth: LoginForm, RegisterForm, AuthHeroPanel

4. Layouts                   ← src/layouts/
      └─ AuthLayout, AppShellLayout

5. Pages (compose only)      ← src/pages/
      └─ LoginPage, RegisterPage, etc.
```

## shadcn/ui Usage

Dùng `npx shadcn@latest add <component>` để thêm vào `src/components/ui/`. Không copy-paste thủ công.

**Các component cần cho Sprint 1:**
- `button` — CTA, submit
- `input` — form fields
- `label` — accessible labels
- `card` — form container

**Upcoming (Sprint 2+):**
- `dialog`, `dropdown-menu`, `tabs`, `avatar`, `badge`, `tooltip`, `select`, `checkbox`, `switch`, `sheet` (drawer)

## Component Conventions

### Props Interface

```tsx
// GOOD: named interface
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive';
  size?: 'sm' | 'default' | 'lg';
  isLoading?: boolean;
}

// BAD: anonymous inline type
export function Button({ variant, size }: { variant: string; size: string }) {}
```

### Forward refs

Extend shadcn components thay vì tái tạo:

```tsx
// GOOD
import { Button as BaseButton } from '@/components/ui/button';

export function LoadingButton({ isLoading, children, ...props }: LoadingButtonProps) {
  return (
    <BaseButton disabled={isLoading} {...props}>
      {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      {children}
    </BaseButton>
  );
}
```

### Form Fields

Pattern chuẩn với React Hook Form:

```tsx
<div className="space-y-1">
  <Label htmlFor="email">Email address</Label>
  <Input
    id="email"
    type="email"
    autoComplete="username"
    aria-invalid={!!errors.email}
    aria-describedby={errors.email ? 'email-error' : undefined}
    {...register('email')}
  />
  {errors.email && (
    <p id="email-error" className="text-xs text-[var(--color-error-text)]" role="alert">
      {errors.email.message}
    </p>
  )}
</div>
```

### API Error Banner

```tsx
{apiError && (
  <div
    role="alert"
    aria-live="assertive"
    className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
  >
    {apiError}
  </div>
)}
```

## Accessibility Checklist

Cho mỗi form component:
- [ ] Mỗi input có `<Label htmlFor>`
- [ ] Error có `aria-describedby` trỏ đến error element ID
- [ ] Error element có `role="alert"` hoặc container có `aria-live`
- [ ] Submit button có `aria-busy={isLoading}`
- [ ] Disabled state trên button khi loading
- [ ] Password field có `aria-label` cho toggle button
- [ ] Tab order logic (top to bottom)
- [ ] Không dùng màu để là indicator duy nhất

## cn() Utility

Dùng `cn()` từ `@/utils/cn.util` để merge classes:

```tsx
import { cn } from '@/utils/cn.util';

<div className={cn('base-class', conditional && 'conditional-class', className)} />
```

## Common Pitfalls

1. **Đừng wrap shadcn Button trong div** — sẽ phá keyboard navigation
2. **Đừng dùng `type="submit"` trong button ngoài form** — dùng `type="button"`
3. **Đừng auto-clear error trên keydown** — clear khi field valid sau validation
4. **Đừng để form còn hiển thị sau navigate** — unmount form khi route change
5. **Đừng expose `confirmPassword` trong request** — omit trước khi gọi API

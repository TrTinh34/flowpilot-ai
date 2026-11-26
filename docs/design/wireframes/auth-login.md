# Wireframe — Login Screen

## Desktop (≥ 1024px) — Split Screen

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                                                                                 │
│  ┌────────────────────────────────────┐  ┌──────────────────────────────────┐  │
│  │ FORM SIDE (white/light bg)         │  │ HERO SIDE (indigo gradient)      │  │
│  │                                    │  │                                  │  │
│  │  ┌──────────────────────────────┐  │  │   [FlowPilot AI Logo — white]    │  │
│  │  │ 🔷 FlowPilot AI             │  │  │                                  │  │
│  │  └──────────────────────────────┘  │  │   ┌──────────────────────────┐  │  │
│  │                                    │  │   │  Kanban Board Preview    │  │  │
│  │  Welcome back                      │  │   │  ┌────┐ ┌────┐ ┌────┐  │  │  │
│  │  Sign in to continue               │  │   │  │ToDo│ │Prog│ │Done│  │  │  │
│  │                                    │  │   │  ├────┤ ├────┤ ├────┤  │  │  │
│  │  Email address                     │  │   │  │■■■■│ │■■■■│ │■■■■│  │  │  │
│  │  ┌────────────────────────────┐    │  │   │  │■■■■│ │■■��■│ └────┘  │  │  │
│  │  │ you@company.com            │    │  │   │  │■■■■│ └────┘          │  │  │
│  │  └────────────────────────────┘    │  │   └──────────────────────────┘  │  │
│  │                                    │  │                                  │  │
│  │  Password                          │  │   Plan smarter.                  │  │
│  │  ┌──────────────────────────┬──┐   │  │   Build together.                │  │
│  │  │ ••••••••                 │👁 │   │  │                                  │  │
│  │  └──────────────────────────┴──┘   │  │   AI-powered project planning    │  │
│  │                                    │  │   and team collaboration for     │  │
│  │  ┌────────────────────────────┐    │  │   modern development teams.      │  │
│  │  │         Sign In            │    │  │                                  │  │
│  │  └────────────────────────────┘    │  └──────────────────────────────────┘  │
│  │                                    │                                        │
│  │  Don't have an account?            │                                        │
│  │  Create one                        │                                        │
│  │                                    │                                        │
│  └────────────────────────────────────┘                                        │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

## Desktop — Error State

```
  │  ┌──────────────────────────────────────┐  │
  │  │ ⚠ Email hoặc mật khẩu không đúng     │  │
  │  └──────────────────────────────────────┘  │
  │                                            │
  │  Email address                             │
  │  ┌────────────────────────────────────┐    │
  │  │ wrong@email.com                    │    │  ← red border
  │  └────────────────────────────────────┘    │
```

## Mobile (< 1024px) — Single Column

```
┌──────────────────────────────────────┐
│                                      │
│  ┌────┐ FlowPilot AI                 │
│                                      │
│  Welcome back                        │
│  Sign in to continue                 │
│                                      │
│  Email address                       │
│  ┌────────────────────────────────┐  │
│  │ you@company.com                │  │
│  └────────────────────────────────┘  │
│                                      │
│  Password                            │
│  ┌──────────────────────────────┬──┐ │
│  │ ••••••••                     │👁 │ │
│  └──────────────────────────────┴──┘ │
│                                      │
│  ┌────────────────────────────────┐  │
│  │          Sign In               │  │
│  └────────────────────────────────┘  │
│                                      │
│  Don't have an account? Create one   │
│                                      │
└──────────────────────────────────────┘
```

## Component Annotations

| Element | Component | Notes |
|---|---|---|
| Logo | `<Logo className="h-8" />` | SVG, currentColor |
| "Welcome back" | `<h1 className="text-page font-semibold">` | |
| Email input | `<Input type="email" autoComplete="username">` | |
| Password input | `<Input type="password" autoComplete="current-password">` | |
| Eye toggle | `<button aria-label="Show/hide password">` | Lucide Eye/EyeOff |
| Sign In button | `<Button type="submit" size="default">` | Full width |
| Error banner | `<div role="alert">` | |
| Register link | `<Link to="/register">` | text-primary |
| Hero panel | `<AuthHeroPanel />` | hidden < 1024px |

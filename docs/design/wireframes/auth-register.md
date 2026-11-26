# Wireframe — Register Screen

## Desktop (≥ 1024px) — Split Screen

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                                                                                 │
│  ┌────────────────────────────────────┐  ┌──────────────────────────────────┐  │
│  │ FORM SIDE                          │  │ HERO SIDE (same as login)        │  │
│  │                                    │  │                                  │  │
│  │  ┌────┐ FlowPilot AI               │  │  [Same AuthHeroPanel component]  │  │
│  │                                    │  │                                  │  │
│  │  Create your account               │  └──────────────────────────────────┘  │
│  │  Start for free today              │                                        │
│  │                                    │                                        │
│  │  Display name                      │                                        │
│  │  ┌────────────────────────────┐    │                                        │
│  │  │ Your Name                  │    │                                        │
│  │  └────────────────────────────┘    │                                        │
│  │                                    │                                        │
│  │  Email address                     │                                        │
│  │  ┌────────────────────────────┐    │                                        │
│  │  │ you@company.com            │    │                                        │
│  │  └────────────────────────────┘    │                                        │
│  │                                    │                                        │
│  │  Password                          │                                        │
│  │  ┌──────────────────────────┬──┐   │                                        │
│  │  │ ••••••••                 │👁 │   │                                        │
│  │  └──────────────────────────┴──┘   │                                        │
│  │  ○ Not empty                       │  ← password guidance (dynamic)         │
│  │  ○ 72 bytes max                    │                                        │
│  │                                    │                                        │
│  │  Confirm password                  │                                        │
│  │  ┌────────────────────────────┐    │                                        │
│  │  │ ••••••••                   │    │                                        │
│  │  └────────────────────────────┘    │                                        │
│  │  ○ Passwords match                 │                                        │
│  │                                    │                                        │
│  │  ┌────────────────────────────┐    │                                        │
│  │  │      Create Account         │    │                                        │
│  │  └────────────────────────────┘    │                                        │
│  │                                    │                                        │
│  │  Already have an account?          │                                        │
│  │  Sign in                           │                                        │
│  │                                    │                                        │
│  └────────────────────────────────────┘                                        │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

## Password Guidance States

```
Before typing:               After valid input:          After invalid:
○ Not empty                  ✓ Not empty                 ✗ Not empty
○ 72 bytes max               ✓ 72 bytes max              ○ 72 bytes max
                             color: success green        color: error red
```

## Success State

```
┌──────────────────────────────────────────┐
│                                          │
│  ✓  Account created successfully!        │
│                                          │
│  Your account has been created.          │
│  Sign in to get started.                 │
│                                          │
│  ┌────────────────────────────────────┐  │
│  │          Sign In                   │  │
│  └────────────────────────────────────┘  │
│                                          │
└──────────────────────────────────────────┘
```

## Component Annotations

| Element | Component | Notes |
|---|---|---|
| Form heading | `<h1>Create your account</h1>` | |
| Display name | `<Input type="text" autoComplete="name">` | min 1 char |
| Email | `<Input type="email" autoComplete="email">` | |
| Password | `<Input type="password" autoComplete="new-password">` | |
| Eye toggle | `<button aria-label>` | Lucide Eye/EyeOff |
| Password rules | `<ul aria-label="Password requirements">` | dynamic checkmarks |
| Confirm password | `<Input type="password" autoComplete="new-password">` | |
| Submit | `<Button type="submit">` | Full width |
| Login link | `<Link to="/login">` | text-primary |
| API payload | omit `confirmPassword` | Zod `.omit({ confirmPassword: true })` |

# Task Dependency Graph

```mermaid
flowchart LR
  Approval["REDESIGN-01 · Review direction"] --> R02["REDESIGN-02 · Tokens"] --> R03["REDESIGN-03 · Shared UI"] --> R04["REDESIGN-04 · Shell"]
  ENV["ENV-01 · Dev schema"] --> R09["REDESIGN-09 · Task lists"]
  R04 --> R05["REDESIGN-05 · Auth"]
  R04 --> R06["REDESIGN-06 · Dashboard"]
  R04 --> R07["REDESIGN-07 · Workspace"] --> R08["REDESIGN-08 · Projects"] --> R09 --> R10["REDESIGN-10 · Board/detail"] --> R11["REDESIGN-11 · Collaboration"]

  R11 --> RF01["REFINE-01 · Skill Integration"] --> RF02["REFINE-02 · Re-audit"]
  RF02 --> Gate{"Developer Approval"}
  Gate --> RF03["REFINE-03 · Design System V2"] --> RF04["REFINE-04 · Shared UI & Shell"]
  RF04 --> RF05A["REFINE-05A · Dashboard/WS/Proj"]
  RF04 --> RF05B["REFINE-05B · Tasks/Board/Detail"]
  RF04 & RF05B --> RF06["REFINE-06 · Collaboration UI"]
  RF05A & RF05B & RF06 --> RF07["REFINE-07 · Regression & Visual QA"]

  RF04 --> R12["REDESIGN-12 · Notifications"]
  RF04 --> R13["REDESIGN-13 · AI Planner"]
  RF04 & R07 --> R14["REDESIGN-14 · Profile & Settings"]
  RF07 & R05 & R12 & R13 & R14 --> R15["REDESIGN-15 · Responsive/a11y"]
  R15 --> R16["REDESIGN-16 · Visual QA"]
```

ENV-01 có thể thực hiện độc lập sau khi phê duyệt môi trường. Nhánh `REFINE-03` → `REFINE-07` là cổng refinement (chờ Developer Approval) trước khi đóng các màn còn lại `REDESIGN-12..16`. Thứ tự quản lý theo [Sprint Backlog](README.md) và [Sprint 08](../sprint-08-frontend-collaboration-quality/README.md).

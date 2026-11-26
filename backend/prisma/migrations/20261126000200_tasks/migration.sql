BEGIN;

-- CreateEnum
CREATE TYPE "task_status" AS ENUM ('TODO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE');

-- CreateEnum
CREATE TYPE "task_priority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT');

-- CreateTable
CREATE TABLE "tasks" (
    "id" UUID NOT NULL,
    "project_id" UUID NOT NULL,
    "parent_id" UUID,
    "assignee_id" UUID,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" "task_status" NOT NULL DEFAULT 'TODO',
    "priority" "task_priority" NOT NULL,
    "due_date" DATE,
    "estimated_hours" DECIMAL(65,30),
    "position" INTEGER NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "tasks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "tasks_project_id_status_position_idx" ON "tasks"("project_id", "status", "position");

-- CreateIndex
CREATE INDEX "tasks_assignee_id_status_idx" ON "tasks"("assignee_id", "status");

-- CreateIndex
CREATE INDEX "tasks_project_id_parent_id_idx" ON "tasks"("project_id", "parent_id");

-- CreateIndex
CREATE UNIQUE INDEX "tasks_project_id_id_key" ON "tasks"("project_id", "id");

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_project_id_parent_id_fkey" FOREIGN KEY ("project_id", "parent_id") REFERENCES "tasks"("project_id", "id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_project_id_assignee_id_fkey" FOREIGN KEY ("project_id", "assignee_id") REFERENCES "project_members"("project_id", "user_id") ON DELETE RESTRICT ON UPDATE RESTRICT;

ALTER TABLE "tasks" ADD CONSTRAINT "tasks_version_non_negative" CHECK ("version" >= 0);
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_parent_not_self" CHECK ("parent_id" <> "id");

COMMIT;

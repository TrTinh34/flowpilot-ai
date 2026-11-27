import { useLayoutEffect, useRef, useState } from 'react';
import type { Task, TaskStatus } from '@/features/task/types/task.types';
import { boardColumns, type BoardMove } from '../types/board.types';
import { KanbanCard } from './KanbanCard';

interface Props {
  tasks: Task[];
  canMove: (task: Task) => boolean;
  pending: boolean;
  onMove: BoardMove;
  assignees?: ReadonlyMap<string, string>;
}

export function KanbanBoard({ tasks, canMove, pending, onMove, assignees }: Props) {
  const [dragged, setDragged] = useState<Task | null>(null);
  const [dropTarget, setDropTarget] = useState<string | null>(null);
  const focusAfterMove = useRef<string | null>(null);
  const canDrop = Boolean(dragged && !pending && canMove(dragged));

  useLayoutEffect(() => {
    if (pending || !focusAfterMove.current) return;
    const control = document.getElementById(focusAfterMove.current);
    focusAfterMove.current = null;
    if (document.activeElement === document.body) control?.focus();
  }, [pending, tasks]);

  function move(task: Task, status: TaskStatus, position?: number) {
    const dest = tasks.filter(
      (candidate) => candidate.status === status && candidate.id !== task.id,
    );
    onMove(task, status, position ?? dest.length);
  }

  function drop(status: TaskStatus, beforeId?: string) {
    if (!dragged || !canDrop) return;
    setDragged(null);
    setDropTarget(null);
    if (dragged.id === beforeId) return;
    const dest = tasks.filter(
      (candidate) => candidate.status === status && candidate.id !== dragged.id,
    );
    const position = beforeId ? dest.findIndex(({ id }) => id === beforeId) : dest.length;
    if (position < 0) return;
    move(dragged, status, position);
  }

  return (
    <div
      role="region"
      aria-label="Kanban columns"
      tabIndex={0}
      className="min-w-0 overflow-x-auto rounded-xl pb-3 focus-visible:outline-offset-[-2px]"
    >
      <div className="grid min-w-[62rem] grid-cols-4 gap-4">
        {boardColumns.map(({ status, label }) => {
          const column = tasks.filter((task) => task.status === status);
          return (
            <section
              key={status}
              aria-label={label}
              className="min-h-56 min-w-0 rounded-xl border border-border bg-muted p-3 data-[drop-target=true]:border-primary data-[drop-target=true]:ring-1 data-[drop-target=true]:ring-primary"
              data-drop-target={dropTarget === status}
              onDragOver={(event) => {
                if (canDrop) {
                  event.preventDefault();
                  setDropTarget(status);
                }
              }}
              onDragLeave={(event) => {
                if (
                  !(event.relatedTarget instanceof Node) ||
                  !event.currentTarget.contains(event.relatedTarget)
                ) {
                  setDropTarget(null);
                }
              }}
              onDrop={(event) => {
                if (!canDrop) return;
                event.preventDefault();
                drop(status);
              }}
            >
              <h2 className="mb-3 flex justify-between font-semibold">
                {label}
                <span className="text-sm">{column.length}</span>
              </h2>
              {column.length === 0 && <p className="min-h-16 text-sm">No tasks</p>}
              <ul className="space-y-2">
                {column.map((task, index) => (
                  <KanbanCard
                    key={task.id}
                    task={task}
                    index={index}
                    count={column.length}
                    canMove={canMove(task)}
                    pending={pending}
                    acceptsDrop={canDrop}
                    assigneeName={task.assigneeId ? assignees?.get(task.assigneeId) : undefined}
                    dropTarget={dropTarget === task.id}
                    onDragOver={() => setDropTarget(task.id)}
                    onDrag={(value) => {
                      setDragged(value);
                      setDropTarget(null);
                    }}
                    onDrop={() => drop(status, task.id)}
                    onMove={(target, position) => {
                      focusAfterMove.current = `move-${task.id}`;
                      move(task, target, position);
                    }}
                  />
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}

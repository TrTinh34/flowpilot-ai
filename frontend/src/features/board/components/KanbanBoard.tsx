import { useState } from 'react';
import type { Task, TaskStatus } from '@/features/task/types/task.types';
import { boardColumns, type BoardMove } from '../types/board.types';
import { KanbanCard } from './KanbanCard';

interface Props {
  tasks: Task[];
  canMove: (task: Task) => boolean;
  pending: boolean;
  onMove: BoardMove;
}

export function KanbanBoard({ tasks, canMove, pending, onMove }: Props) {
  const [dragged, setDragged] = useState<Task | null>(null);
  const canDrop = Boolean(dragged && !pending && canMove(dragged));

  function move(task: Task, status: TaskStatus, position?: number) {
    const dest = tasks.filter(
      (candidate) => candidate.status === status && candidate.id !== task.id,
    );
    onMove(task, status, position ?? dest.length);
  }

  function drop(status: TaskStatus, beforeId?: string) {
    if (!dragged || !canDrop) return;
    setDragged(null);
    if (dragged.id === beforeId) return;
    const dest = tasks.filter(
      (candidate) => candidate.status === status && candidate.id !== dragged.id,
    );
    const position = beforeId ? dest.findIndex(({ id }) => id === beforeId) : dest.length;
    if (position < 0) return;
    move(dragged, status, position);
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {boardColumns.map(({ status, label }) => {
        const column = tasks.filter((task) => task.status === status);
        return (
          <section
            key={status}
            aria-label={label}
            className="min-w-0 rounded border bg-[var(--muted)] p-3"
            onDragOver={(event) => {
              if (canDrop) event.preventDefault();
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
                  onDrag={setDragged}
                  onDrop={() => drop(status, task.id)}
                  onMove={(target, position) => move(task, target, position)}
                />
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}

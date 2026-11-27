import { useLayoutEffect, useRef, useState } from 'react';
import type { Task, TaskStatus } from '@/features/task/types/task.types';
import { boardColumns, type BoardMove } from '../types/board.types';
import { KanbanColumn } from './KanbanColumn';

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
      className="min-w-0 overflow-x-auto pb-2 focus-visible:outline-offset-[-2px]"
    >
      <div className="grid min-w-[68rem] grid-cols-4 gap-4">
        {boardColumns.map(({ status, label }) => {
          const column = tasks.filter((task) => task.status === status);
          return (
            <KanbanColumn
              key={status}
              status={status}
              label={label}
              tasks={column}
              canMove={canMove}
              pending={pending}
              canDrop={canDrop}
              dropTarget={dropTarget}
              assignees={assignees}
              onColumnDragOver={() => setDropTarget(status)}
              onColumnDragLeave={() => setDropTarget(null)}
              onColumnDrop={() => drop(status)}
              onCardDragOver={(id) => setDropTarget(id)}
              onCardDrag={(value) => {
                setDragged(value);
                setDropTarget(null);
              }}
              onCardDrop={(beforeId) => drop(status, beforeId)}
              onMove={(task, target, position) => {
                focusAfterMove.current = `move-${task.id}`;
                move(task, target, position);
              }}
            />
          );
        })}
      </div>
    </div>
  );
}

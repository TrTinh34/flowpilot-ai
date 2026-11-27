import { useId, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { FieldLabel } from '@/components/ui/field-label';
import { Input } from '@/components/ui/input';
import type { ProjectMember } from '@/features/project/api/project.api';
import { taskPriorities, type TaskFields, type TaskPriority } from '../types/task.types';

type Props = {
  initial?: TaskFields;
  members: ProjectMember[];
  onSubmit: (fields: TaskFields) => void;
  pending: boolean;
  label: string;
};

export function TaskForm({ initial, members, onSubmit, pending, label }: Props) {
  const titleId = useId();
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    const fields = new FormData(event.currentTarget);
    const title = String(fields.get('title') ?? '').trim();
    if (!title) {
      const input = event.currentTarget.elements.namedItem('title');
      if (input instanceof HTMLInputElement) {
        input.setCustomValidity('Enter a task title.');
        input.reportValidity();
      }
      return;
    }
    onSubmit({
      title,
      description: String(fields.get('description') ?? '').trim(),
      priority: fields.get('priority') as TaskPriority,
      assigneeId: String(fields.get('assigneeId') ?? '') || null,
      dueDate: String(fields.get('dueDate') ?? '') || null,
    });
  }

  return (
    <form className="grid max-w-xl gap-3 rounded border p-4" onSubmit={submit}>
      <FieldLabel label="Task title" htmlFor={titleId}>
        <Input
          id={titleId}
          name="title"
          required
          defaultValue={initial?.title}
          onInput={(event) => event.currentTarget.setCustomValidity('')}
        />
      </FieldLabel>
      <label className="grid gap-1">
        Description
        <textarea
          className="rounded border p-2"
          name="description"
          defaultValue={initial?.description}
        />
      </label>
      <div className="grid gap-3 sm:grid-cols-3">
        <label className="grid gap-1">
          Priority
          <select
            className="rounded border p-2"
            name="priority"
            defaultValue={initial?.priority ?? 'MEDIUM'}
          >
            {taskPriorities.map((priority) => (
              <option key={priority}>{priority}</option>
            ))}
          </select>
        </label>
        <label className="grid gap-1">
          Assignee
          <select
            className="min-w-0 rounded border p-2"
            name="assigneeId"
            defaultValue={initial?.assigneeId ?? ''}
          >
            <option value="">Unassigned</option>
            {members.map((member) => (
              <option key={member.userId} value={member.userId}>
                {member.user.displayName}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-1">
          Due date
          <Input name="dueDate" type="date" defaultValue={initial?.dueDate?.slice(0, 10)} />
        </label>
      </div>
      <Button className="justify-self-start" disabled={pending}>
        {pending ? 'Saving…' : label}
      </Button>
    </form>
  );
}

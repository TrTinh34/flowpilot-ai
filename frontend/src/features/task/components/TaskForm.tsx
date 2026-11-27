import { useId, useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { FieldLabel } from '@/components/ui/field-label';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import type { ProjectMember } from '@/features/project/api/project.api';
import { taskPriorities, type TaskFields, type TaskPriority } from '../types/task.types';

type Props = {
  initial?: TaskFields;
  members: ProjectMember[];
  onSubmit: (fields: TaskFields) => void;
  pending: boolean;
  label: string;
};

const PRIORITY_LABEL: Record<TaskPriority, string> = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
  URGENT: 'Urgent',
};

export function TaskForm({ initial, members, onSubmit, pending, label }: Props) {
  const titleId = useId();
  const descriptionId = useId();
  const priorityId = useId();
  const assigneeId = useId();
  const dueDateId = useId();
  const [titleError, setTitleError] = useState<string>();

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    const fields = new FormData(event.currentTarget);
    const title = String(fields.get('title') ?? '').trim();
    if (!title) {
      setTitleError('Enter a task title.');
      const input = event.currentTarget.elements.namedItem('title');
      if (input instanceof HTMLInputElement) input.focus();
      return;
    }
    setTitleError(undefined);
    onSubmit({
      title,
      description: String(fields.get('description') ?? '').trim(),
      priority: fields.get('priority') as TaskPriority,
      assigneeId: String(fields.get('assigneeId') ?? '') || null,
      dueDate: String(fields.get('dueDate') ?? '') || null,
    });
  }

  return (
    <form className="grid max-w-xl gap-4" noValidate onSubmit={submit}>
      <FieldLabel label="Task title" htmlFor={titleId}>
        <Input
          id={titleId}
          name="title"
          required
          defaultValue={initial?.title}
          aria-invalid={Boolean(titleError)}
          aria-describedby={titleError ? `${titleId}-error` : undefined}
          onChange={() => {
            if (titleError) setTitleError(undefined);
          }}
        />
        {titleError && (
          <p
            id={`${titleId}-error`}
            role="alert"
            className="text-xs text-[var(--color-error-text)]"
          >
            {titleError}
          </p>
        )}
      </FieldLabel>
      <FieldLabel label="Description" htmlFor={descriptionId}>
        <Textarea
          id={descriptionId}
          name="description"
          rows={3}
          defaultValue={initial?.description}
          placeholder="Add context, acceptance notes, or links…"
        />
      </FieldLabel>
      <div className="grid gap-3 sm:grid-cols-3">
        <FieldLabel label="Priority" htmlFor={priorityId}>
          <Select id={priorityId} name="priority" defaultValue={initial?.priority ?? 'MEDIUM'}>
            {taskPriorities.map((priority) => (
              <option key={priority} value={priority}>
                {PRIORITY_LABEL[priority]}
              </option>
            ))}
          </Select>
        </FieldLabel>
        <FieldLabel label="Assignee" htmlFor={assigneeId}>
          <Select id={assigneeId} name="assigneeId" defaultValue={initial?.assigneeId ?? ''}>
            <option value="">Unassigned</option>
            {members.map((member) => (
              <option key={member.userId} value={member.userId}>
                {member.user.displayName}
              </option>
            ))}
          </Select>
        </FieldLabel>
        <FieldLabel label="Due date" htmlFor={dueDateId}>
          <Input
            id={dueDateId}
            name="dueDate"
            type="date"
            defaultValue={initial?.dueDate?.slice(0, 10)}
          />
        </FieldLabel>
      </div>
      <div className="flex justify-start">
        <Button type="submit" disabled={pending}>
          {pending ? 'Saving…' : label}
        </Button>
      </div>
    </form>
  );
}

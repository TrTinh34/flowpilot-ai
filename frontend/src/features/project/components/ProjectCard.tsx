import { FolderKanban } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import type { Project } from '../api/project.api';

export function ProjectCard({ project }: { project: Project }) {
  return (
    <li className="flex min-w-0 flex-col gap-4 rounded-[var(--radius-lg)] border border-border bg-card p-4">
      <div className="flex items-start justify-between gap-3">
        <span className="grid size-10 place-items-center rounded-md bg-muted text-action-link">
          <FolderKanban className="size-5" aria-hidden="true" />
        </span>
        <Badge tone={project.status === 'ACTIVE' ? 'success' : 'neutral'}>
          {project.status === 'ACTIVE' ? 'Active' : 'Archived'}
        </Badge>
      </div>
      <Link
        to={`/projects/${project.id}`}
        className="break-words font-semibold hover:text-action-link hover:underline"
      >
        {project.name}
      </Link>
      <div className="mt-auto flex flex-wrap gap-4 border-t border-border pt-3 text-sm">
        <Link
          className="text-action-link hover:underline"
          to={`/projects/${project.id}/tasks`}
          aria-label={`Tasks for ${project.name}`}
        >
          Tasks
        </Link>
        <Link
          className="text-action-link hover:underline"
          to={`/projects/${project.id}/board`}
          aria-label={`Board for ${project.name}`}
        >
          Board
        </Link>
      </div>
    </li>
  );
}

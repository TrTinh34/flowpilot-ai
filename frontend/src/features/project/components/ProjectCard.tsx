import { CheckSquare, Columns3, FolderKanban } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import type { Project } from '../api/project.api';

export function ProjectCard({ project }: { project: Project }) {
  return (
    <li className="flex min-w-0 flex-col gap-3 rounded-[var(--radius-md)] border border-border bg-card p-4 transition-colors duration-[var(--duration-ui)] hover:border-control-border/60">
      <div className="flex items-start justify-between gap-3">
        <span className="grid size-9 place-items-center rounded-[var(--radius)] border border-border bg-muted text-action-link">
          <FolderKanban className="size-4" aria-hidden="true" />
        </span>
        <Badge tone={project.status === 'ACTIVE' ? 'success' : 'neutral'}>
          {project.status === 'ACTIVE' ? 'Active' : 'Archived'}
        </Badge>
      </div>
      <Link
        to={`/projects/${project.id}`}
        className="text-card-title font-semibold text-foreground break-words transition-colors hover:text-action-link hover:underline"
      >
        {project.name}
      </Link>
      <div className="mt-auto flex flex-wrap items-center gap-2 border-t border-border pt-3 text-xs">
        <Link
          className="inline-flex items-center gap-1.5 rounded-[var(--radius-sm)] px-2 py-1 font-medium text-action-link transition-colors hover:bg-muted"
          to={`/projects/${project.id}/tasks`}
          aria-label={`Tasks for ${project.name}`}
        >
          <CheckSquare className="size-3.5" aria-hidden="true" />
          Tasks
        </Link>
        <Link
          className="inline-flex items-center gap-1.5 rounded-[var(--radius-sm)] px-2 py-1 font-medium text-action-link transition-colors hover:bg-muted"
          to={`/projects/${project.id}/board`}
          aria-label={`Board for ${project.name}`}
        >
          <Columns3 className="size-3.5" aria-hidden="true" />
          Board
        </Link>
      </div>
    </li>
  );
}

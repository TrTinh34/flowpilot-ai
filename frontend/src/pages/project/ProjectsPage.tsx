import { useParams } from 'react-router-dom';
import { ProjectsForWorkspace } from '@/features/project/components/ProjectsForWorkspace';

export function ProjectsPage() {
  const { workspaceId = '' } = useParams();
  return <ProjectsForWorkspace key={workspaceId} workspaceId={workspaceId} />;
}

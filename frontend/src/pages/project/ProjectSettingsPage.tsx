import { useParams } from 'react-router-dom';
import { ProjectSettings } from '@/features/project/components/ProjectSettings';

export function ProjectSettingsPage() {
  const { projectId = '' } = useParams();
  return <ProjectSettings key={projectId} projectId={projectId} />;
}

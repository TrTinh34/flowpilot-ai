import { useParams } from 'react-router-dom';
import { ProjectTasks } from '@/features/task/components/ProjectTasks';

export function ProjectTasksPage() {
  const { projectId = '' } = useParams();
  return <ProjectTasks key={projectId} projectId={projectId} />;
}

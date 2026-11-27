import { useParams } from 'react-router-dom';
import { TaskDetail } from '@/features/task/components/TaskDetailDrawer';

export function TaskDetailPage() {
  const { taskId = '' } = useParams();
  return <TaskDetail key={taskId} taskId={taskId} />;
}

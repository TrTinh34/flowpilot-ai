import { useQuery } from '@tanstack/react-query';
import { matchPath, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/app/store/auth.store';
import { useWorkspaceStore } from '@/app/store/workspace.store';
import { getProjectMembers } from '@/features/project/api/project.api';
import { getTask } from '@/features/task/api/task.api';
import { listWorkspaceMembers, listWorkspaces } from '@/features/workspace/api/workspace.api';

const sectionTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/my-tasks': 'My Tasks',
  '/notifications': 'Notifications',
  '/workspaces': 'Workspace settings',
  '/invitations/accept': 'Invitation',
  '/ai/planner': 'AI Planner',
  '/settings/profile': 'Profile',
};

export function useShellContext() {
  const { pathname, search } = useLocation();
  const revision = useAuthStore((state) => state.sessionRevision);
  const activeId = useWorkspaceStore((state) => state.activeWorkspaceId);
  const taskId = matchPath('/tasks/:taskId', pathname)?.params.taskId;
  // Page-owned queries populate these observers. The shell never fetches task or project data.
  const task = useQuery({
    queryKey: ['task', revision, taskId ?? ''],
    queryFn: () => getTask(taskId ?? ''),
    enabled: false,
  }).data;
  const projectRoute = matchPath('/projects/:projectId/*', pathname);
  const projectId = projectRoute?.params.projectId ?? task?.projectId;
  const project = useQuery({
    queryKey: ['project-members', revision, projectId ?? ''],
    queryFn: () => getProjectMembers(projectId ?? ''),
    enabled: false,
  }).data?.project;

  const workspaces =
    useQuery({
      queryKey: ['workspaces', revision, 0],
      queryFn: () => listWorkspaces(0),
      staleTime: 30_000,
    }).data?.data ?? [];
  const workspaceRoute = matchPath('/workspaces/:workspaceId/projects', pathname);
  const routeWorkspace =
    workspaceRoute?.params.workspaceId ??
    project?.workspaceId ??
    (pathname === '/workspaces' ? new URLSearchParams(search).get('workspace') : null);
  const workspaceDetails = useQuery({
    queryKey: ['workspace-members', revision, routeWorkspace ?? ''],
    queryFn: () => listWorkspaceMembers(routeWorkspace ?? ''),
    enabled: false,
  }).data?.workspace;
  const workspace = routeWorkspace
    ? (workspaceDetails ?? workspaces.find(({ id }) => id === routeWorkspace))
    : (workspaces.find(({ id }) => id === activeId) ?? workspaces[0]);
  const workspaceId = routeWorkspace ?? workspace?.id;
  const projectTitle =
    projectRoute?.params['*'] === 'board'
      ? 'Board'
      : projectRoute?.params['*'] === 'tasks'
        ? 'Tasks'
        : 'Project settings';

  return {
    workspaces,
    workspace,
    workspaceId,
    project,
    title: taskId
      ? (task?.title ?? 'Task details')
      : projectRoute
        ? projectRoute.params['*']
          ? projectTitle
          : (project?.name ?? projectTitle)
        : workspaceRoute
          ? 'Projects'
          : (sectionTitles[pathname] ?? 'Workspace'),
    inProject: Boolean(projectRoute || taskId),
  };
}

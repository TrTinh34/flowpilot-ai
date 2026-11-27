import { useRef, useState } from 'react';
import axios from 'axios';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { acceptInvitation } from '@/features/workspace/api/workspace.api';
import { extractApiErrorMessage } from '@/services/api-client';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/common/PageHeader';
import { FormErrorBanner } from '@/components/common/FormErrorBanner';

export function AcceptWorkspaceInvitation() {
  const navigate = useNavigate();
  const { hash } = useLocation();
  const token = new URLSearchParams(hash.slice(1)).get('token');
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const accepting = useRef(false);

  async function accept() {
    if (!token || accepting.current) return;
    accepting.current = true;
    setPending(true);
    setError('');
    try {
      const membership = await acceptInvitation(token);
      navigate(`/workspaces?workspace=${membership.workspaceId}`, { replace: true });
    } catch (cause) {
      setError(
        axios.isAxiosError<{ code?: string }>(cause) &&
          cause.response?.data.code === 'INVALID_INVITATION'
          ? 'This invitation is invalid or expired. Ask a workspace administrator for a new link.'
          : extractApiErrorMessage(cause),
      );
    } finally {
      setPending(false);
      accepting.current = false;
    }
  }

  return (
    <div className="mx-auto w-full max-w-lg px-page-gutter py-12">
      <section className="space-y-4 rounded-[var(--radius-md)] border border-border bg-card p-5">
        <PageHeader
          title="Workspace invitation"
          description="Join the workspace with the account that received this invitation."
        />
        <FormErrorBanner message={error || (!token ? 'This invitation link is incomplete.' : '')} />
        <div className="flex flex-wrap items-center gap-3">
          {token && (
            <Button disabled={pending} onClick={() => void accept()}>
              {pending ? 'Joining…' : 'Accept invitation'}
            </Button>
          )}
          <Button asChild variant="outline">
            <Link to="/workspaces">Back to workspaces</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}

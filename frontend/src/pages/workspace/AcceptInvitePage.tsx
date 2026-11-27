import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { acceptInvitation } from '@/features/workspace/api/workspace.api';
import { extractApiErrorMessage } from '@/services/api-client';
import { Button } from '@/components/ui/button';

export function AcceptInvitePage() {
  const navigate = useNavigate();
  const { hash } = useLocation();
  const token = new URLSearchParams(hash.slice(1)).get('token');
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');

  async function accept() {
    if (!token) return;
    setPending(true);
    setError('');
    try {
      const membership = await acceptInvitation(token);
      navigate(`/workspaces?workspace=${membership.workspaceId}`, { replace: true });
    } catch (cause) {
      setError(extractApiErrorMessage(cause));
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="mx-auto max-w-md px-page-gutter py-12">
      <h1 className="text-2xl font-semibold">Workspace invitation</h1>
      {token ? (
        <Button className="mt-5" disabled={pending} onClick={() => void accept()}>
          {pending ? 'Joining…' : 'Accept invitation'}
        </Button>
      ) : (
        <p className="mt-3" role="alert">
          This invitation link is incomplete.
        </p>
      )}
      {error && (
        <p className="mt-3" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

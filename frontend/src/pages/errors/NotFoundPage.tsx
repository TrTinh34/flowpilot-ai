import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export function NotFoundPage() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center gap-4 px-6 text-center">
      <p className="text-6xl font-bold text-[var(--color-primary)]">404</p>
      <h1 className="text-2xl font-semibold text-[var(--foreground)]">Page not found</h1>
      <p className="text-sm text-[var(--foreground-secondary)]">
        The page you&apos;re looking for doesn&apos;t exist or was moved.
      </p>
      <Button asChild>
        <Link to="/dashboard">Go to Dashboard</Link>
      </Button>
    </main>
  );
}

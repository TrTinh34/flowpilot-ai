import { Button } from '@/components/ui/button';

export function Pagination({
  page,
  hasNext,
  onPageChange,
}: {
  page: number;
  hasNext: boolean;
  onPageChange: (page: number) => void;
}) {
  if (!page && !hasNext) return null;

  return (
    <nav className="flex flex-wrap items-center gap-2" aria-label="Pagination">
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={page === 0}
        onClick={() => onPageChange(page - 1)}
      >
        Previous
      </Button>
      <span className="text-secondary" aria-live="polite">
        Page {page + 1}
      </span>
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={!hasNext}
        onClick={() => onPageChange(page + 1)}
      >
        Next
      </Button>
    </nav>
  );
}

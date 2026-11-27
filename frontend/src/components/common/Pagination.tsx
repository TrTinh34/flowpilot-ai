import { ChevronLeft, ChevronRight } from 'lucide-react';
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
        <ChevronLeft aria-hidden="true" />
        Previous
      </Button>
      <span
        className="px-2 text-xs font-medium tabular-nums text-muted-foreground"
        aria-live="polite"
      >
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
        <ChevronRight aria-hidden="true" />
      </Button>
    </nav>
  );
}

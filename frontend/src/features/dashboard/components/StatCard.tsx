export function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="min-w-0 rounded-xl border border-border bg-card p-4">
      <dt className="text-secondary">{label}</dt>
      <dd className="mt-2 text-3xl font-semibold tabular-nums">{value}</dd>
    </div>
  );
}

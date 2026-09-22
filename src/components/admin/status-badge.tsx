import type { Status } from "@/lib/admin-api";

export const STATUSES: { value: Status; label: string }[] = [
  { value: "new", label: "New" },
  { value: "read", label: "Read" },
  { value: "contacted", label: "Contacted" },
];

const styles: Record<Status, string> = {
  new: "bg-accent-500 text-white",
  read: "bg-mist-100 text-charcoal-700 ring-1 ring-mist-300",
  contacted: "bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200",
};

export function StatusBadge({ status }: { status: Status }) {
  return (
    <span className={`inline-flex items-center rounded-lg px-2 py-0.5 text-xs font-bold ${styles[status]}`}>
      {STATUSES.find((s) => s.value === status)?.label}
    </span>
  );
}

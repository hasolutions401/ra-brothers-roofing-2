"use client";

import type { Page, Query, SubmissionRow } from "@/lib/admin-api";
import { selectStyle } from "@/components/form-styles";
import { StatusBadge } from "./status-badge";
import { formatWhen } from "./format";

type Sortable = Query["sort"];

const columns: { key: Sortable; label: string; className?: string }[] = [
  { key: "name", label: "Who" },
  { key: "form_type", label: "Form" },
  { key: "service", label: "Needs", className: "hidden xl:table-cell" },
  { key: "town", label: "Town", className: "hidden lg:table-cell" },
  { key: "created_at", label: "Received" },
  { key: "status", label: "Status" },
];

/**
 * The submissions list: a sortable table from md up, stacked rows on
 * phones. Each row opens the full submission.
 */
export function SubmissionsTable({
  page,
  query,
  loading,
  timeZone,
  onSort,
  onOpen,
  onPage,
}: {
  page: Page | null;
  query: Query;
  loading: boolean;
  timeZone: string;
  onSort: (sort: Sortable) => void;
  onOpen: (row: SubmissionRow) => void;
  onPage: (changes: Partial<Query>) => void;
}) {
  const rows = page?.data ?? [];
  const empty = page !== null && rows.length === 0;

  return (
    <section aria-labelledby="results-heading" className="mt-4 overflow-hidden rounded-2xl bg-white ring-1 ring-mist-200">
      <h2 id="results-heading" className="sr-only">Submissions</h2>
      <p className="sr-only" aria-live="polite">
        {loading ? "Loading submissions" : page ? `${page.meta.total} ${page.meta.total === 1 ? "submission" : "submissions"}` : ""}
      </p>

      {/* Table, md and up */}
      <table className="hidden w-full text-left text-sm md:table" aria-busy={loading}>
        <thead className="border-b border-mist-200 bg-mist-50 text-xs uppercase tracking-wider text-charcoal-500">
          <tr>
            {columns.map((column) => {
              const sorted = query.sort === column.key;
              return (
                <th
                  key={column.key}
                  scope="col"
                  aria-sort={sorted ? (query.dir === "asc" ? "ascending" : "descending") : undefined}
                  className={`px-4 py-3 font-semibold ${column.className ?? ""}`}
                >
                  <button
                    type="button"
                    onClick={() => onSort(column.key)}
                    className={`inline-flex items-center gap-1 uppercase tracking-wider hover:text-navy-900 ${sorted ? "text-navy-900" : ""}`}
                  >
                    {column.label}
                    <span aria-hidden="true" className={sorted ? "" : "opacity-30"}>
                      {sorted && query.dir === "asc" ? "▲" : "▼"}
                    </span>
                  </button>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody className={`divide-y divide-mist-200 ${loading ? "opacity-60" : ""}`}>
          {rows.map((row) => (
            <tr
              key={row.id}
              onClick={() => onOpen(row)}
              className={`cursor-pointer transition hover:bg-mist-50 ${row.status === "new" ? "bg-accent-500/[0.04]" : ""}`}
            >
              <td className="px-4 py-3">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpen(row);
                  }}
                  data-row={row.id}
                  className={`text-left text-navy-900 hover:underline ${row.status === "new" ? "font-bold" : "font-semibold"}`}
                >
                  {row.name}
                </button>
                <div className="text-xs tabular-nums text-charcoal-500">{row.phone}</div>
              </td>
              <td className="px-4 py-3 text-charcoal-700">
                {row.form_label}
                {row.photos_count > 0 && (
                  <span className="ml-1.5 text-xs text-charcoal-500">· {row.photos_count} photo{row.photos_count === 1 ? "" : "s"}</span>
                )}
              </td>
              <td className="hidden max-w-[16rem] truncate px-4 py-3 text-charcoal-700 xl:table-cell">{row.service ?? "—"}</td>
              <td className="hidden px-4 py-3 text-charcoal-700 lg:table-cell">{row.town ?? "—"}</td>
              <td className="whitespace-nowrap px-4 py-3 text-charcoal-700">{formatWhen(row.created_at, timeZone)}</td>
              <td className="px-4 py-3"><StatusBadge status={row.status} /></td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Stacked rows, phones */}
      <ul className={`divide-y divide-mist-200 md:hidden ${loading ? "opacity-60" : ""}`} aria-busy={loading}>
        {rows.map((row) => (
          <li key={row.id}>
            <button
              type="button"
              onClick={() => onOpen(row)}
              data-row={row.id}
              className={`flex w-full items-start justify-between gap-3 px-4 py-3.5 text-left transition hover:bg-mist-50 ${row.status === "new" ? "bg-accent-500/[0.04]" : ""}`}
            >
              <span className="min-w-0">
                <span className={`block truncate text-navy-900 ${row.status === "new" ? "font-bold" : "font-semibold"}`}>{row.name}</span>
                <span className="block text-sm tabular-nums text-charcoal-500">{row.phone}</span>
                <span className="mt-1 block text-xs text-charcoal-500">
                  {row.form_label}{row.town ? ` · ${row.town}` : ""} · {formatWhen(row.created_at, timeZone)}
                </span>
              </span>
              <StatusBadge status={row.status} />
            </button>
          </li>
        ))}
      </ul>

      {page === null && <p className="px-4 py-10 text-center text-sm text-charcoal-500">Loading submissions…</p>}
      {empty && (
        <p className="px-4 py-10 text-center text-sm text-charcoal-500">
          {query.search || query.form_type || query.status || query.from || query.to
            ? "No submissions match these filters."
            : "No submissions yet. They appear here as soon as someone sends a form."}
        </p>
      )}

      {page && page.meta.total > 0 && (
        <nav aria-label="Pages" className="flex flex-wrap items-center justify-between gap-3 border-t border-mist-200 px-4 py-3 text-sm">
          <p className="text-charcoal-500">
            Showing <span className="font-semibold text-navy-900">{page.meta.from}–{page.meta.to}</span> of{" "}
            <span className="font-semibold text-navy-900">{page.meta.total}</span>
          </p>
          <div className="flex items-center gap-2">
            <label className="flex items-center gap-2 text-charcoal-500">
              <span className="hidden sm:inline">Per page</span>
              <select
                value={query.per_page}
                onChange={(e) => onPage({ per_page: Number(e.target.value) as Query["per_page"], page: 1 })}
                className="appearance-none rounded-lg border border-navy-400 bg-white py-1.5 pl-2.5 pr-8 text-sm text-charcoal-900"
                style={selectStyle}
                aria-label="Rows per page"
              >
                {[10, 25, 50, 100].map((n) => <option key={n}>{n}</option>)}
              </select>
            </label>
            <button
              type="button"
              onClick={() => onPage({ page: query.page - 1 })}
              disabled={page.meta.current_page <= 1}
              className="rounded-lg border border-navy-200 px-3 py-1.5 font-semibold text-navy-900 transition hover:bg-mist-50 disabled:opacity-40"
            >
              ← Previous
            </button>
            <span className="tabular-nums text-charcoal-500">
              {page.meta.current_page} / {page.meta.last_page}
            </span>
            <button
              type="button"
              onClick={() => onPage({ page: query.page + 1 })}
              disabled={page.meta.current_page >= page.meta.last_page}
              className="rounded-lg border border-navy-200 px-3 py-1.5 font-semibold text-navy-900 transition hover:bg-mist-50 disabled:opacity-40"
            >
              Next →
            </button>
          </div>
        </nav>
      )}
    </section>
  );
}

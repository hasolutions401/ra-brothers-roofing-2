"use client";

import { useEffect, useId, useState } from "react";
import type { Query } from "@/lib/admin-api";
import { IconSearch } from "@/components/icons";
import { selectStyle } from "@/components/form-styles";
import { STATUSES } from "./status-badge";

const field =
  "w-full rounded-xl border border-navy-400 bg-white px-3 py-2.5 text-sm text-charcoal-900 transition " +
  "focus:border-navy-600 focus:outline-none focus:ring-2 focus:ring-navy-600/20";
const label = "mb-1 block text-xs font-semibold uppercase tracking-wider text-charcoal-500";

/** Search box (debounced) plus form, status and date filters. */
export function Filters({ query, onChange }: { query: Query; onChange: (changes: Partial<Query>) => void }) {
  const id = useId();
  const [search, setSearch] = useState(query.search);

  // Keep the box in step when a tile or "Clear" resets the search.
  const [lastQuerySearch, setLastQuerySearch] = useState(query.search);
  if (query.search !== lastQuerySearch) {
    setLastQuerySearch(query.search);
    setSearch(query.search);
  }

  useEffect(() => {
    if (search === query.search) return;
    const timer = setTimeout(() => onChange({ search }), 300);
    return () => clearTimeout(timer);
  }, [search, query.search, onChange]);

  const filtered = query.search || query.form_type || query.status || query.from || query.to;

  return (
    <div className="mt-4 grid gap-3 rounded-2xl bg-white p-4 ring-1 ring-mist-200 sm:grid-cols-2 lg:grid-cols-[minmax(0,2fr)_repeat(4,minmax(0,1fr))_auto] lg:items-end">
      <div className="sm:col-span-2 lg:col-span-1">
        <label htmlFor={`${id}-search`} className={label}>Search</label>
        <div className="relative">
          <IconSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal-500" />
          <input
            id={`${id}-search`}
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Name, phone, email, town…"
            maxLength={100}
            className={`${field} pl-9`}
          />
        </div>
      </div>
      <div>
        <label htmlFor={`${id}-form`} className={label}>Form</label>
        <select
          id={`${id}-form`}
          value={query.form_type}
          onChange={(e) => onChange({ form_type: e.target.value as Query["form_type"] })}
          className={`${field} appearance-none pr-9`}
          style={selectStyle}
        >
          <option value="">All forms</option>
          <option value="estimate">Estimate form</option>
          <option value="quick">Quick form</option>
        </select>
      </div>
      <div>
        <label htmlFor={`${id}-status`} className={label}>Status</label>
        <select
          id={`${id}-status`}
          value={query.status}
          onChange={(e) => onChange({ status: e.target.value as Query["status"] })}
          className={`${field} appearance-none pr-9`}
          style={selectStyle}
        >
          <option value="">Any status</option>
          {STATUSES.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor={`${id}-from`} className={label}>From</label>
        <input
          id={`${id}-from`}
          type="date"
          value={query.from}
          max={query.to || undefined}
          onChange={(e) => onChange({ from: e.target.value })}
          className={field}
        />
      </div>
      <div>
        <label htmlFor={`${id}-to`} className={label}>To</label>
        <input
          id={`${id}-to`}
          type="date"
          value={query.to}
          min={query.from || undefined}
          onChange={(e) => onChange({ to: e.target.value })}
          className={field}
        />
      </div>
      <button
        type="button"
        onClick={() => onChange({ search: "", form_type: "", status: "", from: "", to: "" })}
        disabled={!filtered}
        className="rounded-xl px-3 py-2.5 text-sm font-semibold text-accent-600 underline underline-offset-4 transition hover:text-accent-700 disabled:text-charcoal-500 disabled:no-underline disabled:opacity-60"
      >
        Clear filters
      </button>
    </div>
  );
}

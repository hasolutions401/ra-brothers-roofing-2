"use client";

import { SiteLink as Link } from "./site-link";
import { useMemo, useState } from "react";
import { states, towns, townCount, type StateCode, type Town } from "@/lib/areas";
import type { Phone } from "@/lib/site";
import { IconPhone, IconPin, IconSearch } from "./icons";

type Filter = "all" | StateCode;

const filters: { key: Filter; label: string; short: string }[] = [
  { key: "all", label: "All", short: "All" },
  { key: "NH", label: "New Hampshire", short: "NH" },
  { key: "MA", label: "Massachusetts", short: "MA" },
];

export function AreaExplorer() {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  const results = useMemo(() => {
    const needle = q.toLowerCase().replace(/[,\.]/g, " ").trim().replace(/\s+/g, " ");
    return towns.filter((t) => {
      if (filter !== "all" && t.state !== filter) return false;
      if (!needle) return true;
      return (
        t.name.toLowerCase().includes(needle) ||
        t.state.toLowerCase() === needle ||
        `${t.name} ${t.state}`.toLowerCase().includes(needle)
      );
    });
  }, [q, filter]);

  return (
    <div>
      {/* Controls */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <IconSearch className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-charcoal-500" />
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={`Search ${townCount} towns…`}
            aria-label="Search towns"
            className="w-full rounded-xl border border-navy-400 bg-white py-3 pl-12 pr-4 text-base text-charcoal-900 transition placeholder:text-charcoal-500 focus:border-navy-600 focus:outline-none focus:ring-2 focus:ring-navy-600/20"
          />
        </div>
        <div role="group" aria-label="Filter by state" className="flex rounded-xl border border-mist-300 bg-white p-1">
          {filters.map(({ key, label, short }) => (
            <button
              key={key}
              type="button"
              onClick={() => setFilter(key)}
              aria-pressed={filter === key}
              aria-label={label}
              className={`flex-1 whitespace-nowrap rounded-lg px-4 py-2 text-sm font-semibold transition sm:flex-none ${
                filter === key ? "bg-navy-900 text-white" : "text-charcoal-700 hover:bg-mist-100 hover:text-navy-900"
              }`}
            >
              <span className="sm:hidden">{short}</span>
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>
      </div>

      <p className="sr-only" aria-live="polite">
        {results.length === 1 ? "1 town" : `${results.length} towns`} shown
      </p>

      {/* Results */}
      {results.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-mist-300 bg-mist-50 px-6 py-12 text-center">
          <p className="text-base font-bold text-navy-900">No town matching “{q}”</p>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-charcoal-500">
            The service area grows as the crew does. Call us anyway: we will tell
            you whether we can get to you, and point you to someone reputable if
            we cannot.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {states.map((st) => (
              <a
                key={st.code}
                href={st.phone.href}
                className="inline-flex items-center gap-2 rounded-xl border border-navy-200 bg-white px-5 py-3 text-sm font-bold text-navy-900 transition hover:border-navy-400"
              >
                <IconPhone className="h-4 w-4 text-accent-600" />
                {st.code} · {st.phone.display}
              </a>
            ))}
          </div>
        </div>
      ) : (
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          {states.map((st) => {
            const list = results.filter((t) => t.state === st.code);
            return list.length > 0 ? <Column key={st.code} title={st.name} phone={st.phone} towns={list} /> : null;
          })}
        </div>
      )}
    </div>
  );
}

function Column({ title, phone, towns: list }: { title: string; phone: Phone; towns: Town[] }) {
  return (
    <div className="min-w-0 rounded-2xl border border-mist-200 bg-white p-5 sm:p-6">
      {/* Heading and phone stack on phones so the number never pushes past the card. */}
      <div className="flex flex-col gap-1.5 border-b border-mist-200 pb-4 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
        <h3 className="text-lg font-bold text-navy-900">
          {title}{" "}
          <span className="font-sans text-xs font-semibold uppercase tracking-wider text-charcoal-500">
            {list.length} {list.length === 1 ? "town" : "towns"}
          </span>
        </h3>
        <a
          href={phone.href}
          className="flex shrink-0 items-center gap-1.5 text-sm font-bold tabular-nums text-accent-600 transition hover:text-accent-700"
        >
          <IconPhone className="h-4 w-4" />
          {phone.display}
        </a>
      </div>

      <ul className="mt-3 grid grid-cols-2 gap-x-6 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3">
        {list.map((t) => (
          <li key={`${t.name}-${t.state}`}>
            {t.slug ? (
              <Link
                href={`/service-areas/${t.slug}`}
                className="flex items-center gap-1.5 border-b border-mist-100 py-2 text-sm font-semibold text-accent-600 underline-offset-4 transition hover:text-accent-700 hover:underline"
              >
                <IconPin className="h-3.5 w-3.5 shrink-0" />
                {t.name}
              </Link>
            ) : (
              <span className="flex items-center border-b border-mist-100 py-2 text-sm text-charcoal-700">
                {t.name}
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

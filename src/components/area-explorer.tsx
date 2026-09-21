"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { towns, townCount, type StateCode } from "@/lib/areas";
import { PHONE_MA, PHONE_NH } from "@/lib/site";
import { IconPin, IconSearch } from "./icons";

type Filter = "all" | StateCode;

export function AreaExplorer() {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  const results = useMemo(() => {
    const needle = q.trim().toLowerCase();
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

  const nh = results.filter((t) => t.state === "NH");
  const ma = results.filter((t) => t.state === "MA");

  return (
    <div>
      {/* Controls */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <IconSearch className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-stone-400" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={`Search ${townCount} towns…`}
            aria-label="Search towns"
            className="h-[52px] w-full rounded-[3px] border border-ink/14 bg-white pl-12 pr-4 text-[14.5px] outline-none transition-colors placeholder:text-stone-400 focus:border-navy-600"
          />
        </div>
        <div
          role="group"
          aria-label="Filter by state"
          className="flex rounded-[3px] border border-ink/14 bg-white p-1"
        >
          {(
            [
              ["all", "All"],
              ["NH", "New Hampshire"],
              ["MA", "Massachusetts"],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setFilter(key)}
              aria-pressed={filter === key}
              className={`h-[42px] whitespace-nowrap rounded-[2px] px-4 font-display text-[12.5px] font-bold transition-colors ${
                filter === key
                  ? "bg-navy-900 text-white"
                  : "text-stone-600 hover:text-ink"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      {results.length === 0 ? (
        <div className="mt-10 rounded-[3px] border border-dashed border-ink/18 bg-paper px-6 py-12 text-center">
          <p className="font-display text-[16px] font-bold text-ink">
            No town matching “{q}”
          </p>
          <p className="mx-auto mt-3 max-w-md text-[14px] leading-relaxed text-stone-600">
            The service area grows as the crew does. Call us anyway — we will
            tell you honestly whether we can get to you, and point you to
            someone reputable if we cannot.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {[PHONE_NH, PHONE_MA].map((p) => (
              <a
                key={p.state}
                href={p.href}
                className="inline-flex h-11 items-center rounded-[3px] border border-ink/18 px-5 font-display text-[13px] font-bold text-ink hover:border-ink/45"
              >
                {p.state} · {p.display}
              </a>
            ))}
          </div>
        </div>
      ) : (
        <div className="mt-10 grid gap-x-14 gap-y-12 lg:grid-cols-2">
          {nh.length > 0 && (
            <Column
              title="New Hampshire"
              count={nh.length}
              phone={PHONE_NH.display}
              phoneHref={PHONE_NH.href}
              towns={nh}
            />
          )}
          {ma.length > 0 && (
            <Column
              title="Massachusetts"
              count={ma.length}
              phone={PHONE_MA.display}
              phoneHref={PHONE_MA.href}
              towns={ma}
            />
          )}
        </div>
      )}
    </div>
  );
}

function Column({
  title,
  count,
  phone,
  phoneHref,
  towns: list,
}: {
  title: string;
  count: number;
  phone: string;
  phoneHref: string;
  towns: typeof towns;
}) {
  return (
    <div>
      <div className="flex items-end justify-between gap-4 border-b border-ink/12 pb-4">
        <div>
          <h3 className="text-[20px] text-ink">{title}</h3>
          <p className="mt-1.5 text-[12.5px] text-stone-500">
            {count} {count === 1 ? "town" : "towns"}
          </p>
        </div>
        <a
          href={phoneHref}
          className="shrink-0 font-display text-[14px] font-extrabold tabular-nums text-copper-600 hover:text-copper-700"
        >
          {phone}
        </a>
      </div>

      <ul className="mt-5 grid grid-cols-2 gap-x-6 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3">
        {list.map((t) => (
          <li key={`${t.name}-${t.state}`}>
            {t.slug ? (
              <Link
                href={`/service-areas/${t.slug}`}
                className="group flex items-center gap-1.5 border-b border-ink/6 py-2.5 text-[13.5px] font-semibold text-ink"
              >
                <IconPin className="h-[13px] w-[13px] shrink-0 text-copper-600" />
                <span className="link-underline">{t.name}</span>
              </Link>
            ) : (
              <span className="flex items-center gap-1.5 border-b border-ink/6 py-2.5 text-[13.5px] text-stone-600">
                {t.name}
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

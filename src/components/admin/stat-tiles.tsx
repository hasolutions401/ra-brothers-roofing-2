import type { Query, Stats } from "@/lib/admin-api";

export type Tile = "total" | "new" | "today" | "week";

/** The filters each tile applies. Days come from the server's calendar. */
export function tileFilters(tile: Tile, stats: Stats): Partial<Query> {
  const none = { search: "", form_type: "", status: "", from: "", to: "" } as const;
  if (tile === "new") return { ...none, status: "new" };
  if (tile === "today") return { ...none, from: stats.today_date, to: stats.today_date };
  if (tile === "week") return { ...none, from: stats.week_start_date };
  return none;
}

export function activeTile(query: Query, stats: Stats | null): Tile | null {
  if (!stats) return null;
  const tiles: Tile[] = ["new", "today", "week", "total"];
  return tiles.find((tile) => Object.entries(tileFilters(tile, stats)).every(([key, value]) => query[key as keyof Query] === value)) ?? null;
}

/**
 * The overview numbers. Each one is also a shortcut that filters the table
 * to exactly those submissions.
 */
export function StatTiles({ stats, active, onSelect }: { stats: Stats | null; active: Tile | null; onSelect: (tile: Tile) => void }) {
  const tiles: { tile: Tile; label: string; value?: number; hint: string }[] = [
    { tile: "total", label: "All submissions", value: stats?.total, hint: "Show all" },
    { tile: "new", label: "New, not yet opened", value: stats?.new, hint: "Show new" },
    { tile: "today", label: "Today", value: stats?.today, hint: "Show today’s" },
    { tile: "week", label: "This week", value: stats?.this_week, hint: "Since Monday" },
  ];

  return (
    <ul className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4" aria-label="Overview">
      {tiles.map(({ tile, label, value, hint }) => {
        const isActive = active === tile;
        return (
          <li key={tile}>
            <button
              type="button"
              onClick={() => onSelect(tile)}
              disabled={!stats}
              aria-pressed={isActive}
              className={`flex h-full w-full flex-col items-start rounded-2xl bg-white p-4 text-left ring-1 transition sm:p-5 ${
                isActive ? "ring-2 ring-accent-500" : "ring-mist-200 hover:ring-navy-200"
              } ${tile === "new" && (value ?? 0) > 0 ? "border-l-4 border-accent-500" : ""}`}
            >
              <span className="text-sm font-semibold text-charcoal-500">{label}</span>
              <span className="mt-1 font-display text-3xl font-extrabold tabular-nums text-navy-900 sm:text-4xl">
                {value ?? "–"}
              </span>
              <span className="mt-1 text-xs font-semibold text-accent-600">{hint}</span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}

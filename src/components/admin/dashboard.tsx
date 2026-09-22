"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { adminApi, type Page, type Query, type Stats, type SubmissionDetail, type SubmissionRow } from "@/lib/admin-api";
import { toProblem } from "@/lib/api";
import { useAdminAuth } from "./admin-auth";
import { AdminShell } from "./admin-shell";
import { StatTiles, activeTile, tileFilters, type Tile } from "./stat-tiles";
import { Filters } from "./filters";
import { SubmissionsTable } from "./submissions-table";
import { SubmissionPanel } from "./submission-panel";
import { DEFAULT_TIME_ZONE } from "./format";
import { setQueryParam, useQueryParam } from "./use-query-param";

const initialQuery: Query = {
  search: "",
  form_type: "",
  status: "",
  from: "",
  to: "",
  sort: "created_at",
  dir: "desc",
  page: 1,
  per_page: 25,
};

/**
 * /admin/: sends anyone not signed in to the sign-in page (keeping ?id= so
 * a link from a new-lead email still lands on that lead), then shows the
 * dashboard. The API enforces access either way; this is only navigation.
 */
export function Dashboard() {
  const auth = useAdminAuth();
  const router = useRouter();

  useEffect(() => {
    if (auth.status !== "signed-out") return;
    const next = `/admin/${window.location.search}`;
    router.replace(`/admin/login/?next=${encodeURIComponent(next)}${auth.expired ? "&expired=1" : ""}`);
  }, [auth, router]);

  return (
    <AdminShell title="Leads">
      {auth.status === "signed-in" ? (
        <DashboardBody />
      ) : (
        <p className="mt-6 text-sm text-charcoal-500" role="status">Checking your session…</p>
      )}
    </AdminShell>
  );
}

function DashboardBody() {
  const [query, setQuery] = useState<Query>(initialQuery);
  const [page, setPage] = useState<Page | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [exporting, setExporting] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const openParam = useQueryParam("id");
  const openId = openParam && /^\d+$/.test(openParam) ? Number(openParam) : null;
  const timeZone = stats?.timezone ?? DEFAULT_TIME_ZONE;

  const refresh = useCallback(() => setRefreshKey((key) => key + 1), []);

  // The list, whenever the query changes or something was edited.
  useEffect(() => {
    const controller = new AbortController();
    adminApi.list(query, controller.signal).then(
      (result) => {
        // A deleted last row can leave us past the final page.
        if (result.data.length === 0 && query.page > 1) {
          setQuery((q) => ({ ...q, page: Math.max(1, result.meta.last_page) }));
          return;
        }
        setPage(result);
        setError("");
        setLoading(false);
      },
      (e) => {
        if (controller.signal.aborted) return;
        setError(toProblem(e).message);
        setLoading(false);
      },
    );
    return () => controller.abort();
  }, [query, refreshKey]);

  // The overview numbers, on load, after edits, and when the tab regains focus.
  useEffect(() => {
    adminApi.stats().then(setStats, () => undefined);
  }, [refreshKey]);

  useEffect(() => {
    const onVisible = () => document.visibilityState === "visible" && refresh();
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, [refresh]);

  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(""), 4000);
    return () => clearTimeout(timer);
  }, [notice]);

  const update = useCallback((changes: Partial<Query>) => {
    setLoading(true);
    setQuery((q) => ({ ...q, page: 1, ...changes }));
  }, []);

  // Same column flips the order; a new column starts newest-first for dates, A–Z otherwise.
  const sortBy = (sort: Query["sort"]) =>
    update({ sort, dir: query.sort === sort ? (query.dir === "asc" ? "desc" : "asc") : sort === "created_at" ? "desc" : "asc" });

  const selectTile = (tile: Tile) => stats && update(tileFilters(tile, stats));

  // Opening adds a history entry, so Back closes the panel. Closing undoes
  // that entry rather than adding another; a lead opened from a link
  // (e.g. a new-lead email) has no entry to undo, so its ?id is replaced.
  const openedHere = useRef(false);
  const open = (row: SubmissionRow) => {
    openedHere.current = true;
    setQueryParam("id", String(row.id));
  };
  const close = useCallback(() => {
    if (openedHere.current) {
      openedHere.current = false;
      window.history.back();
    } else {
      setQueryParam("id", null, "replace");
    }
  }, []);

  // Keep the row in step with the panel (it becomes "read" when opened).
  const changed = useCallback((detail: SubmissionDetail) => {
    setPage((current) => current && {
      ...current,
      data: current.data.map((row) => (row.id === detail.id ? { ...row, status: detail.status } : row)),
    });
    adminApi.stats().then(setStats, () => undefined);
  }, []);

  const deleted = useCallback((id: number) => {
    close();
    setNotice("Submission deleted.");
    setPage((current) => current && { ...current, data: current.data.filter((row) => row.id !== id) });
    refresh();
  }, [close, refresh]);

  const exportCsv = async () => {
    setExporting(true);
    setError("");
    try {
      await adminApi.exportCsv(query);
    } catch (e) {
      setError(`The export failed. ${toProblem(e).message}`);
    } finally {
      setExporting(false);
    }
  };

  return (
    <>
      <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-charcoal-500">
          Every request sent through the website’s forms. Times are {timeZone === DEFAULT_TIME_ZONE ? "Eastern" : timeZone}.
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => { setLoading(true); refresh(); }}
            className="rounded-xl px-4 py-2.5 text-sm font-semibold text-navy-900 ring-1 ring-navy-200 transition hover:bg-white"
          >
            Refresh
          </button>
          <button
            type="button"
            onClick={exportCsv}
            disabled={exporting || !page || page.meta.total === 0}
            className="rounded-xl bg-accent-500 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-accent-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {exporting ? "Preparing CSV…" : "Export CSV"}
          </button>
        </div>
      </div>

      <StatTiles stats={stats} active={activeTile(query, stats)} onSelect={selectTile} />
      <Filters query={query} onChange={update} />

      {error && <p role="alert" className="mt-4 rounded-lg border border-red-700 bg-white p-3 text-sm text-red-700">{error}</p>}

      <SubmissionsTable
        page={page}
        query={query}
        loading={loading}
        timeZone={timeZone}
        onSort={sortBy}
        onOpen={open}
        onPage={(changes) => { setLoading(true); setQuery((q) => ({ ...q, ...changes })); }}
      />

      <p role="status" aria-live="polite" className={notice ? "fixed bottom-4 left-1/2 z-[60] -translate-x-1/2 rounded-xl bg-navy-900 px-4 py-3 text-sm font-semibold text-white shadow-xl" : "sr-only"}>
        {notice}
      </p>

      {openId !== null && (
        <SubmissionPanel
          key={openId}
          id={openId}
          timeZone={timeZone}
          onClose={close}
          onChanged={changed}
          onDeleted={deleted}
        />
      )}
    </>
  );
}

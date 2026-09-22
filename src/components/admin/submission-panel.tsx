"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { isAxiosError } from "axios";
import { adminApi, type Status, type SubmissionDetail } from "@/lib/admin-api";
import { toProblem } from "@/lib/api";
import { IconPhone, IconPin } from "@/components/icons";
import { STATUSES, StatusBadge } from "./status-badge";
import { formatBytes, formatDateTime } from "./format";

/**
 * Everything about one submission, in a panel over the list. Opening a new
 * submission marks it read on the server. Esc, the close button or the
 * backdrop close it; focus stays inside while it is open.
 */
export function SubmissionPanel({
  id,
  timeZone,
  onClose,
  onChanged,
  onDeleted,
}: {
  id: number;
  timeZone: string;
  onClose: () => void;
  onChanged: (submission: SubmissionDetail) => void;
  onDeleted: (id: number) => void;
}) {
  const [submission, setSubmission] = useState<SubmissionDetail | null>(null);
  const [loadError, setLoadError] = useState("");
  const [actionError, setActionError] = useState("");
  const [saving, setSaving] = useState<Status | "delete" | null>(null);
  const [confirming, setConfirming] = useState(false);
  const dialog = useRef<HTMLDivElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const onChangedRef = useRef(onChanged);
  useEffect(() => { onChangedRef.current = onChanged; });

  useEffect(() => {
    const controller = new AbortController();
    adminApi.get(id, controller.signal).then(
      (detail) => {
        setSubmission(detail);
        setLoadError("");
        onChangedRef.current(detail); // it may have just become "read"
      },
      (error) => {
        if (controller.signal.aborted) return;
        const problem = toProblem(error);
        setLoadError(isAxiosError(error) && error.response?.status === 404 ? "This submission no longer exists." : problem.message);
      },
    );
    return () => controller.abort();
  }, [id]);

  // Focus, Esc, Tab trap, no page scroll behind, and focus back on close.
  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    closeButton.current?.focus();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key !== "Tab" || !dialog.current) return;
      const focusable = [...dialog.current.querySelectorAll<HTMLElement>("a[href],button:not([disabled]),[tabindex='0']")];
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last?.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first?.focus(); }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
      // The row may have re-rendered; find it again. The table and the phone
      // list both carry it, so take the one that is visible.
      const row = opener?.dataset.row
        ? [...document.querySelectorAll<HTMLElement>(`[data-row="${opener.dataset.row}"]`)].find((el) => el.offsetParent !== null)
        : opener;
      row?.focus();
    };
  }, [onClose]);

  const changeStatus = async (status: Status) => {
    if (!submission || submission.status === status) return;
    setSaving(status);
    setActionError("");
    try {
      const updated = await adminApi.setStatus(submission.id, status);
      setSubmission(updated);
      onChanged(updated);
    } catch (error) {
      setActionError(toProblem(error).message);
    } finally {
      setSaving(null);
    }
  };

  const remove = async () => {
    if (!submission) return;
    setSaving("delete");
    setActionError("");
    try {
      await adminApi.remove(submission.id);
      onDeleted(submission.id);
    } catch (error) {
      setActionError(toProblem(error).message);
      setSaving(null);
    }
  };

  const s = submission;
  const d = s?.details;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-navy-950/50" onClick={onClose} aria-hidden="true" />
      <div
        ref={dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="panel-title"
        className="relative flex h-full w-full max-w-xl flex-col bg-white shadow-2xl"
      >
        <div className="flex items-start justify-between gap-4 border-b border-mist-200 px-5 py-4 sm:px-6">
          <div className="min-w-0">
            <h2 id="panel-title" className="truncate text-xl font-bold text-navy-900">
              {s ? s.name : loadError ? "Submission" : "Loading…"}
            </h2>
            {s && (
              <p className="mt-0.5 text-sm text-charcoal-500">
                {s.form_label} · {formatDateTime(s.created_at, timeZone)}
              </p>
            )}
          </div>
          <button
            ref={closeButton}
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-lg px-3 py-2 text-sm font-semibold text-charcoal-700 ring-1 ring-mist-300 transition hover:bg-mist-50"
          >
            Close
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-6">
          {loadError && <p role="alert" className="rounded-lg border border-red-700 p-3 text-sm text-red-700">{loadError}</p>}

          {s && (
            <>
              <div className="flex flex-wrap gap-2">
                <a href={`tel:+1${s.phone.replace(/\D/g, "").slice(-10)}`} className="inline-flex items-center gap-2 rounded-xl bg-accent-500 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-accent-600">
                  <IconPhone className="h-4 w-4" /> Call {s.phone}
                </a>
                {s.email && (
                  <a href={`mailto:${s.email}`} className="inline-flex items-center rounded-xl px-4 py-2.5 text-sm font-bold text-navy-900 ring-1 ring-navy-200 transition hover:bg-mist-50">
                    Email
                  </a>
                )}
                {(s.address || s.town) && s.town !== "Outside this list" && (
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent([s.address, s.town].filter(Boolean).join(", "))}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-bold text-navy-900 ring-1 ring-navy-200 transition hover:bg-mist-50"
                  >
                    <IconPin className="h-4 w-4" /> Map
                  </a>
                )}
              </div>

              <fieldset className="mt-6">
                <legend className="text-xs font-bold uppercase tracking-wider text-charcoal-500">Status</legend>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  {STATUSES.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      aria-pressed={s.status === option.value}
                      disabled={saving !== null}
                      onClick={() => changeStatus(option.value)}
                      className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                        s.status === option.value
                          ? "bg-navy-900 text-white"
                          : "text-navy-900 ring-1 ring-navy-200 hover:bg-mist-50"
                      } disabled:cursor-wait`}
                    >
                      {saving === option.value ? "Saving…" : option.value === "new" ? "Mark as new" : option.value === "read" ? "Mark as read" : "Mark as contacted"}
                    </button>
                  ))}
                </div>
                <p className="mt-2 text-xs text-charcoal-500">
                  Now <StatusBadge status={s.status} />
                  {s.contacted_at && <> · contacted {formatDateTime(s.contacted_at, timeZone)}</>}
                </p>
              </fieldset>

              <Section title="Contact" list>
                <Item k="Name" v={s.name} />
                <Item k="Phone" v={s.phone} />
                <Item k="Email" v={s.email} />
                {d && <Item k="Best time" v={d.best_time} />}
              </Section>

              <Section title="Request" list>
                <Item k="Service" v={s.service ?? "Not sure yet"} />
                {d && (
                  <>
                    <Item k="Property" v={d.property_type} />
                    <Item k="Roof age" v={d.roof_age} />
                    <Item k="Seeing" v={d.conditions.length ? d.conditions.join(", ") : "Nothing selected"} />
                    <Item k="Insurance" v={d.insurance} />
                    <Item k="Estimate" v={d.estimate_type} />
                  </>
                )}
              </Section>

              <Section title="Location" list>
                <Item k="Town" v={s.town} />
                <Item k="Address" v={s.address} />
              </Section>

              {s.message && (
                <Section title="Notes">
                  <p className="whitespace-pre-line break-words text-sm leading-relaxed text-charcoal-900">{s.message}</p>
                </Section>
              )}

              {s.photos.length > 0 && (
                <Section title={`Photos (${s.photos.length})`}>
                  <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {s.photos.map((photo) => (
                      <li key={photo.id}>
                        <a
                          href={adminApi.photoUrl(photo.path)}
                          target="_blank"
                          rel="noopener"
                          className="block overflow-hidden rounded-2xl ring-1 ring-mist-200 transition hover:ring-accent-500"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element -- private, cookie-authenticated API image */}
                          <img
                            src={adminApi.photoUrl(photo.path)}
                            alt={`Photo ${photo.original_name}`}
                            loading="lazy"
                            className="aspect-[4/3] w-full bg-mist-100 object-cover"
                          />
                        </a>
                        <p className="mt-1 truncate text-xs text-charcoal-500" title={photo.original_name}>
                          {photo.original_name} · {formatBytes(photo.size)}
                        </p>
                      </li>
                    ))}
                  </ul>
                </Section>
              )}

              <Section title="Sent from" list>
                <Item k="Page" v={s.source_page} />
                <Item k="Received" v={formatDateTime(s.created_at, timeZone)} />
                <Item k="IP address" v={s.ip_address} />
                <Item k="Browser" v={s.user_agent} small />
              </Section>
            </>
          )}
        </div>

        {s && (
          <div className="border-t border-mist-200 px-5 py-4 sm:px-6">
            {actionError && <p role="alert" className="mb-3 text-sm font-medium text-red-700">{actionError}</p>}
            {confirming ? (
              <div className="rounded-xl border border-red-700 p-4" role="group" aria-label="Confirm delete">
                <p className="text-sm text-charcoal-900">
                  Delete this submission{s.photos.length ? " and its photos" : ""}? This cannot be undone.
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={remove}
                    disabled={saving !== null}
                    className="rounded-xl bg-red-700 px-4 py-2 text-sm font-bold text-white transition hover:bg-red-800 disabled:cursor-wait"
                  >
                    {saving === "delete" ? "Deleting…" : "Delete permanently"}
                  </button>
                  <button type="button" onClick={() => setConfirming(false)} className="rounded-xl px-4 py-2 text-sm font-semibold text-charcoal-700 ring-1 ring-mist-300 hover:bg-mist-50">
                    Keep it
                  </button>
                </div>
              </div>
            ) : (
              <button type="button" onClick={() => setConfirming(true)} className="text-sm font-semibold text-red-700 underline underline-offset-4 hover:text-red-800">
                Delete submission
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function Section({ title, list, children }: { title: string; list?: boolean; children: ReactNode }) {
  return (
    <section className="mt-6 border-t border-mist-200 pt-5">
      <h3 className="text-xs font-bold uppercase tracking-wider text-charcoal-500">{title}</h3>
      {list ? <dl className="mt-3">{children}</dl> : <div className="mt-3">{children}</div>}
    </section>
  );
}

function Item({ k, v, small }: { k: string; v: string | null | undefined; small?: boolean }) {
  return (
    <div className="flex gap-4 py-1 text-sm">
      <dt className="w-24 shrink-0 text-charcoal-500">{k}</dt>
      <dd className={`min-w-0 break-words [overflow-wrap:anywhere] ${v ? "text-charcoal-900" : "text-charcoal-500"} ${small ? "text-xs" : ""}`}>
        {v || "—"}
      </dd>
    </div>
  );
}

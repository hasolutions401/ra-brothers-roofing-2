"use client";

import { useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from "react";
import { services } from "@/lib/services";
import { states } from "@/lib/areas";
import { DEMO_MODE, PHONE_MA, PHONE_NH, site } from "@/lib/site";
import { API_ENABLED, toProblem } from "@/lib/api";
import { formOptions } from "@/lib/form-options";
import { sendSubmission, useFormTimer } from "@/lib/submissions";
import { resizePhoto } from "@/lib/resize-photo";
import { IconArrow, IconCheck, IconPhone } from "./icons";
import { Button } from "./ui";
import { Honeypot } from "./honeypot";
import { PrivacyNote } from "./privacy-note";
import { errorClass, inputClass, isEmail, isPhone, labelClass, selectStyle } from "./form-styles";

const STEPS = ["What you need", "The property", "Location and photos", "Your details"];

/** The last service choice, for visitors who do not know what the roof needs. */
const NOT_SURE = "Not sure yet";

// Shared with the API's validation (backend/config/form-options.json).
const {
  conditions,
  estimateTypes,
  insurance: insuranceOptions,
  roofAges,
  bestTimes,
  photos: photoLimits,
} = formOptions;

type Data = {
  service: string;
  propertyType: string;
  roofAge: string;
  conditions: string[];
  estimateType: string;
  insurance: string;
  photos: File[];
  town: string;
  address: string;
  name: string;
  phone: string;
  email: string;
  best: string;
  notes: string;
};

const empty: Data = {
  service: "",
  propertyType: "Residential",
  roofAge: "",
  conditions: [],
  estimateType: "Whatever you recommend",
  insurance: "Not sure yet",
  photos: [],
  town: "",
  address: "",
  name: "",
  phone: "",
  email: "",
  best: "Anytime",
  notes: "",
};

type Errors = Partial<Record<"service" | "roofAge" | "town" | "photos" | "name" | "phone" | "email", string>>;

/**
 * Where each API field lives in the form, so a server-side rejection sends
 * the visitor back to the right step. Fields without their own message slot
 * are summarized above the buttons instead.
 */
const serverFields: Record<string, { key?: keyof Errors; step: number }> = {
  service: { key: "service", step: 0 },
  property_type: { step: 1 },
  roof_age: { key: "roofAge", step: 1 },
  conditions: { step: 1 },
  insurance: { step: 1 },
  town: { key: "town", step: 2 },
  address: { step: 2 },
  estimate_type: { step: 2 },
  photos: { key: "photos", step: 2 },
  name: { key: "name", step: 3 },
  phone: { key: "phone", step: 3 },
  email: { key: "email", step: 3 },
  best_time: { step: 3 },
  notes: { step: 3 },
};

/** What each step needs before it lets you continue. */
function validate(step: number, d: Data): Errors {
  if (step === 0) return d.service ? {} : { service: "Choose the service closest to what you need." };
  if (step === 1) return d.roofAge ? {} : { roofAge: "Pick a rough age, or “Not sure”." };
  if (step === 2) return d.town ? {} : { town: "Choose your town, or “My town is not on this list”." };
  const e: Errors = {};
  if (!d.name.trim()) e.name = "Please add your name.";
  if (!isPhone(d.phone)) e.phone = "Please add a phone number we can call back.";
  if (d.email && !isEmail(d.email)) e.email = "That email address does not look complete.";
  return e;
}

export function EstimateForm({ headingLevel = 3, initialTown = "", initialService = "", anchorId }: {
  headingLevel?: 2 | 3;
  initialTown?: string;
  initialService?: string;
  anchorId?: string;
}) {
  const id = useId();
  const [step, setStep] = useState(0);
  const [data, setData] = useState<Data>({ ...empty, town: initialTown, service: initialService });
  const [errors, setErrors] = useState<Errors>({});
  const [done, setDone] = useState(false);
  const [deliveryError, setDeliveryError] = useState("");
  const [sending, setSending] = useState(false);
  const [progress, setProgress] = useState<number | null>(null);
  const [preparingPhotos, setPreparingPhotos] = useState(false);
  const deliveryMessage = useRef<HTMLParagraphElement>(null);
  const shell = useRef<HTMLDivElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const honeypot = useRef<HTMLInputElement>(null);
  const moved = useRef(false);
  const elapsed = useFormTimer();
  const Heading = headingLevel === 2 ? "h2" : "h3";
  const phone = data.town.endsWith(", MA") ? PHONE_MA : PHONE_NH;

  const set =<K extends keyof Data>(k: K, v: Data[K]) => {
    setData((d) => ({ ...d, [k]: v }));
    setErrors((e) => ({ ...e, [k]: undefined }));
  };

  // After the visitor moves between steps, put focus on the new step's
  // heading so keyboard and screen-reader users land at its start.
  useEffect(() => {
    if (moved.current) heading.current?.focus({ preventScroll: true });
  }, [step, done]);

  useEffect(() => {
    if (deliveryError) deliveryMessage.current?.focus();
  }, [deliveryError]);

  /**
   * Steps differ a lot in height, so advancing can leave the card partly
   * off-screen. Pull it back into view whenever the step changes.
   */
  const goTo = (next: number | "done") => {
    moved.current = true;
    setErrors({});
    if (next === "done") setDone(true);
    else setStep(next);

    const el = shell.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top;
    if (top < 80 || top > window.innerHeight * 0.5) {
      window.scrollTo({ top: window.scrollY + top - 110, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    }
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (sending || preparingPhotos) return;
    const found = validate(step, data);
    setErrors(found);
    const first = Object.keys(found)[0];
    if (first) {
      document.getElementById(`${id}-${first}`)?.focus();
      return;
    }
    if (step < STEPS.length - 1) {
      goTo(step + 1);
      return;
    }
    if (API_ENABLED) {
      void send();
      return;
    }
    if (!DEMO_MODE) {
      // No backend in this build. Keep the entered details and files; never
      // report success for an unsent request.
      setDeliveryError("Your request has not been sent. Online requests are not connected yet. Please call the number above to arrange your estimate.");
      return;
    }
    goTo("done");
  };

  /** Deliver to the API. Success is only shown once the server has stored it. */
  const send = async () => {
    setSending(true);
    setProgress(data.photos.length > 0 ? 0 : null);
    setDeliveryError("");
    try {
      await sendSubmission(
        {
          form_type: "estimate",
          service: data.service,
          property_type: data.propertyType,
          roof_age: data.roofAge,
          conditions: data.conditions,
          insurance: data.insurance,
          town: data.town,
          address: data.address,
          estimate_type: data.estimateType,
          photos: data.photos,
          name: data.name,
          phone: data.phone,
          email: data.email,
          best_time: data.best,
          notes: data.notes,
        },
        { elapsedMs: elapsed(), honeypot: honeypot.current?.value ?? "", onProgress: setProgress },
      );
      goTo("done");
    } catch (error) {
      const problem = toProblem(error);
      const found: Errors = {};
      const unplaced: string[] = [];
      let earliest = STEPS.length - 1;
      for (const [field, message] of Object.entries(problem.fields)) {
        const place = serverFields[field.split(".")[0]];
        if (place?.key) found[place.key] ??= message;
        else unplaced.push(message);
        if (place) earliest = Math.min(earliest, place.step);
      }

      if (problem.kind === "validation" && Object.keys(found).length > 0) {
        if (earliest !== step) goTo(earliest);
        setErrors(found);
      }
      if (problem.kind !== "validation" || unplaced.length > 0 || Object.keys(found).length === 0) {
        const detail = unplaced.length > 0 ? unplaced.join(" ") : problem.message;
        setDeliveryError(`Your request has not been sent. ${detail} Your answers are still here, or call ${phone.display}.`);
      }
    } finally {
      setSending(false);
      setProgress(null);
    }
  };

  /** Add photos, shrunk on this device first so they upload quickly. */
  const addPhotos = async (files: File[]) => {
    const fresh = files.filter((file) => !data.photos.some((old) => old.lastModified === file.lastModified && old.name.replace(/\.[^.]+$/, "") === file.name.replace(/\.[^.]+$/, "")));
    const room = photoLimits.maxFiles - data.photos.length;
    const problems: string[] = [];
    if (fresh.length > room) problems.push(`You can attach up to ${photoLimits.maxFiles} photos.`);

    setPreparingPhotos(true);
    const ready: File[] = [];
    for (const file of fresh.slice(0, Math.max(0, room))) {
      try {
        ready.push(await resizePhoto(file, photoLimits.maxDimension));
      } catch {
        problems.push(`“${file.name}” could not be opened on this device. Try a JPG or PNG copy of it, or a screenshot of the photo.`);
      }
    }
    setPreparingPhotos(false);

    setData((d) => ({ ...d, photos: [...d.photos, ...ready] }));
    setErrors((e) => ({ ...e, photos: problems.join(" ") || undefined }));
  };

  const err =(k: keyof Errors) => (errors[k] ? `${id}-${k}-error` : undefined);

  if (done) {
    return (
      <div id={anchorId} ref={shell} tabIndex={-1} className="scroll-mt-24 rounded-2xl bg-white p-6 shadow-xl ring-1 ring-mist-200 sm:p-8">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent-500/10">
          <IconCheck className="h-6 w-6 text-accent-600" />
        </div>
        <Heading ref={heading} tabIndex={-1} className="mt-5 text-xl font-bold text-navy-900 outline-none">
          {API_ENABLED ? `Thank you, ${data.name.trim().split(/\s+/)[0]}. Your request is in.` : "Preview complete. Nothing was sent."}
        </Heading>
        {
          <>
            <p className="mt-3 text-sm leading-relaxed text-charcoal-500 sm:text-base">
              {API_ENABLED ? (
                <>
                  {site.callback} We will look over your answers
                  {data.photos.length > 0 ? " and photos" : ""} before we call.
                </>
              ) : (
                <>
                  This is a preview of the site, so the form is not connected to an
                  inbox yet. Your details and selected photos remain in this page
                  only. Please call to arrange an estimate.
                </>
              )}
            </p>
            <div className="mt-6 rounded-xl bg-mist-50 p-5 ring-1 ring-mist-200">
              <p className="mb-3 text-xs font-bold uppercase tracking-wider text-charcoal-500">
                {API_ENABLED ? "What you sent" : "What would have been sent"}
              </p>
              <dl className="space-y-2 text-sm">
                <Row k="Service" v={data.service} />
                <Row k="Property" v={data.propertyType} />
                <Row k="Roof age" v={data.roofAge} />
                <Row k="Seeing" v={data.conditions.join(", ") || "Not specified"} />
                <Row k="Insurance" v={data.insurance} />
                <Row k="Location" v={data.town} />
                {data.address && <Row k="Address" v={data.address} />}
                <Row k="Estimate" v={data.estimateType} />
                {data.photos.length > 0 && <Row k="Photos" v={`${data.photos.length} ${API_ENABLED ? "sent" : "attached"}`} />}
                <Row k="Name" v={data.name} />
                <Row k="Phone" v={data.phone} />
                {data.email && <Row k="Email" v={data.email} />}
                <Row k="Best time" v={data.best} />
                {data.notes && <Row k="Notes" v={data.notes} />}
              </dl>
            </div>
          </>
        }

        <div className="mt-7 flex flex-wrap items-center gap-3">
          <Button href={phone.href}>
            <IconPhone className="h-4 w-4" />
            Call {phone.display}
          </Button>
          <button
            type="button"
            onClick={() => {
              moved.current = true;
              setDone(false);
              setStep(0);
              setData({ ...empty, town: initialTown, service: initialService });
              setDeliveryError("");
            }}
            className="text-sm font-semibold text-accent-600 underline underline-offset-4 hover:text-accent-700"
          >
            {API_ENABLED ? "Send another request" : "Start over"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div id={anchorId} ref={shell} tabIndex={-1} className="scroll-mt-24 rounded-2xl bg-white shadow-xl ring-1 ring-mist-200">
      <form onSubmit={submit} noValidate aria-busy={sending} className="relative">
        <Honeypot inputRef={honeypot} />
        {/* Progress */}
        <div className="px-5 pt-6 sm:px-7">
          <div className="flex items-baseline justify-between gap-3">
            <Heading ref={heading} tabIndex={-1} className="text-lg font-bold text-navy-900 outline-none sm:text-xl">
              {STEPS[step]}
            </Heading>
            <span className="shrink-0 text-xs font-semibold uppercase tracking-wider text-charcoal-500">
              Step {step + 1} of {STEPS.length}
            </span>
          </div>
          <p className="sr-only" aria-live="polite">
            Step {step + 1} of {STEPS.length}: {STEPS[step]}
          </p>
          <p className="sr-only" role="alert">{Object.values(errors).filter(Boolean).join(" ")}</p>
          {API_ENABLED ? (
            <p className="mt-2 text-xs leading-relaxed text-charcoal-500">
              Prefer to talk?{" "}
              <a href={phone.href} className="font-semibold text-accent-600 underline underline-offset-2">
                Call {phone.display}
              </a>
            </p>
          ) : (
            <p className="mt-2 text-xs leading-relaxed text-charcoal-500">
              {DEMO_MODE ? "Preview form, not connected yet." : "Online requests are not available yet."}{" "}
              <a href={phone.href} className="font-semibold text-accent-600 underline underline-offset-2">
                Call {phone.display}
              </a>{" "}
              to make an inquiry now.
            </p>
          )}
          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-mist-200" aria-hidden="true">
            <div
              className="h-full rounded-full bg-accent-500 transition-[width] duration-500 ease-out"
              style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="space-y-6 px-5 py-6 sm:px-7">
          {step === 0 && (
            <Group legend="Which service do you need?" error={errors.service} errorId={err("service")}>
              <div className="grid gap-2">
                {[...services.map((s) => s.name), NOT_SURE].map((name, i) => (
                  <Choice
                    key={name}
                    id={i === 0 ? `${id}-service` : undefined}
                    type="radio"
                    name={`${id}-service`}
                    label={name === NOT_SURE ? "Not sure yet: help me work out what the roof needs" : name}
                    checked={data.service === name}
                    onChange={() => set("service", name)}
                  />
                ))}
              </div>
            </Group>
          )}

          {step === 1 && (
            <>
              <Group legend="Property type">
                <div className="grid grid-cols-2 gap-2">
                  {["Residential", "Commercial"].map((t) => (
                    <Choice
                      key={t}
                      type="radio"
                      name={`${id}-propertyType`}
                      label={t}
                      checked={data.propertyType === t}
                      onChange={() => set("propertyType", t)}
                    />
                  ))}
                </div>
              </Group>
              <Group legend="Roughly how old is the roof?" error={errors.roofAge} errorId={err("roofAge")}>
                <div className="grid gap-2 sm:grid-cols-2">
                  {roofAges.map((a, i) => (
                    <Choice
                      key={a}
                      id={i === 0 ? `${id}-roofAge` : undefined}
                      type="radio"
                      name={`${id}-roofAge`}
                      label={a}
                      checked={data.roofAge === a}
                      onChange={() => set("roofAge", a)}
                    />
                  ))}
                </div>
              </Group>
              <Group legend="What are you seeing?" hint="Select any that apply">
                <div className="grid gap-2 sm:grid-cols-2">
                  {conditions.map((c) => (
                    <Choice
                      key={c}
                      type="checkbox"
                      name={`${id}-conditions`}
                      label={c}
                      checked={data.conditions.includes(c)}
                      onChange={() =>
                        set(
                          "conditions",
                          data.conditions.includes(c)
                            ? data.conditions.filter((x) => x !== c)
                            : [...data.conditions, c],
                        )
                      }
                    />
                  ))}
                </div>
              </Group>
              <Group legend="Is this an insurance claim?">
                <div className="grid grid-cols-3 gap-2">
                  {insuranceOptions.map((o) => (
                    <Choice
                      key={o}
                      type="radio"
                      name={`${id}-insurance`}
                      label={o}
                      compact
                      checked={data.insurance === o}
                      onChange={() => set("insurance", o)}
                    />
                  ))}
                </div>
              </Group>
            </>
          )}

          {step === 2 && (
            <>
              <div>
                <label htmlFor={`${id}-town`} className={labelClass}>
                  Town
                </label>
                <select
                  id={`${id}-town`}
                  name="town"
                  autoComplete="address-level2"
                  required
                  value={data.town}
                  onChange={(e) => set("town", e.target.value)}
                  aria-invalid={!!errors.town}
                  aria-describedby={err("town")}
                  className={`${inputClass} appearance-none pr-10`}
                  style={selectStyle}
                >
                  <option value="">Select your town…</option>
                  {states.map((st) => (
                    <optgroup key={st.code} label={st.name}>
                      {st.towns.map((t) => (
                        <option key={t.name} value={`${t.name}, ${st.code}`}>
                          {t.name}, {st.code}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                  <option value="Outside this list">My town is not on this list</option>
                </select>
                {errors.town && (
                  <p id={err("town")} className={errorClass}>
                    {errors.town}
                  </p>
                )}
                {data.town === "Outside this list" && (
                  <p className="mt-2.5 text-sm leading-relaxed text-charcoal-500">
                    Give us a call anyway. We will tell you whether we can get to
                    you, and recommend someone if we cannot.
                  </p>
                )}
              </div>
              <Field
                id={`${id}-address`}
                label="Street address"
                optional
                name="street-address"
                autoComplete="street-address"
                value={data.address}
                onChange={(v) => set("address", v)}
              />
              <p className="-mt-3 text-xs leading-relaxed text-charcoal-500">For a remote estimate, include the street address so the correct roof can be identified.</p>
              <Group legend="How would you like your estimate?">
                <div className="grid gap-2">
                  {estimateTypes.map((o) => (
                    <Choice
                      key={o}
                      type="radio"
                      name={`${id}-estimateType`}
                      label={o}
                      checked={data.estimateType === o}
                      onChange={() => set("estimateType", o)}
                    />
                  ))}
                </div>
              </Group>
              <div>
                <label htmlFor={`${id}-photos`} className={labelClass}>
                  Photos of the roof{" "}
                  <span className="font-normal text-charcoal-500">(optional, speeds up a remote estimate)</span>
                </label>
                <label className="flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-dashed border-navy-400 px-4 py-3.5 text-sm text-charcoal-500 transition hover:border-navy-600 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-accent-500">
                  <span aria-live="polite">
                    {preparingPhotos
                      ? "Preparing photos…"
                      : data.photos.length > 0
                        ? `${data.photos.length} photo${data.photos.length === 1 ? "" : "s"} selected`
                        : "Add photos from your phone or computer"}
                  </span>
                  <span className="shrink-0 font-semibold text-accent-600">Browse</span>
                  <input
                    id={`${id}-photos`}
                    type="file"
                    name="photos"
                    accept="image/*"
                    multiple
                    disabled={preparingPhotos}
                    aria-invalid={!!errors.photos}
                    aria-describedby={errors.photos ? `${id}-photos-error` : undefined}
                    className="sr-only"
                    onChange={(e) => {
                      const added = Array.from(e.target.files ?? []);
                      e.target.value = "";
                      if (API_ENABLED) {
                        void addPhotos(added);
                        return;
                      }
                      set("photos", [...data.photos, ...added.filter((file) => !data.photos.some((old) => old.name === file.name && old.size === file.size && old.lastModified === file.lastModified))]);
                    }}
                  />
                </label>
                {errors.photos && (
                  <p id={`${id}-photos-error`} className={errorClass}>
                    {errors.photos}
                  </p>
                )}
                {data.photos.length > 0 && (
                  <ul className="mt-3 space-y-2 text-sm" aria-label="Selected photos">
                    {data.photos.map((file, i) => (
                      <li key={`${file.name}-${file.lastModified}-${i}`} className="flex min-w-0 items-center justify-between gap-3">
                        <span className="min-w-0 break-all">{file.name}</span>
                        <button type="button" className="shrink-0 px-2 py-2 font-semibold text-accent-600 underline" aria-label={`Remove ${file.name}`} onClick={() => set("photos", data.photos.filter((_, index) => index !== i))}>Remove</button>
                      </li>
                    ))}
                  </ul>
                )}
                <p className="mt-2 text-xs leading-relaxed text-charcoal-500">
                  {API_ENABLED
                    ? `Up to ${photoLimits.maxFiles} photos. Photos straight from your phone are fine (JPG, PNG, WebP, or HEIC from an iPhone): we shrink them on your device, so there is no size limit to worry about. Use photos taken safely from the ground. Only our team sees them.`
                    : "Use photos taken safely from the ground. Files stay in this page until it is closed or refreshed; they have not been uploaded."}
                </p>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field
                  id={`${id}-name`}
                  label="Full name"
                  name="name"
                  autoComplete="name"
                  value={data.name}
                  onChange={(v) => set("name", v)}
                  error={errors.name}
                />
                <Field
                  id={`${id}-phone`}
                  label="Phone"
                  type="tel"
                  name="tel"
                  autoComplete="tel"
                  value={data.phone}
                  onChange={(v) => set("phone", v)}
                  error={errors.phone}
                />
              </div>
              <Field
                id={`${id}-email`}
                label="Email"
                optional
                type="email"
                name="email"
                autoComplete="email"
                value={data.email}
                onChange={(v) => set("email", v)}
                error={errors.email}
              />
              <Group legend="Best time to reach you">
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {bestTimes.map((t) => (
                    <Choice
                      key={t}
                      type="radio"
                      name={`${id}-best`}
                      label={t}
                      compact
                      checked={data.best === t}
                      onChange={() => set("best", t)}
                    />
                  ))}
                </div>
              </Group>
              <div>
                <label htmlFor={`${id}-notes`} className={labelClass}>
                  Anything else we should know <span className="font-normal text-charcoal-500">(optional)</span>
                </label>
                <textarea
                  id={`${id}-notes`}
                  name="notes"
                  rows={3}
                  value={data.notes}
                  onChange={(e) => set("notes", e.target.value)}
                  placeholder="Gate code, dog in the yard, when the leak started…"
                  className={`${inputClass} resize-y`}
                />
              </div>
            </>
          )}
        </div>

        {deliveryError && <p ref={deliveryMessage} tabIndex={-1} role="alert" className="mx-5 mb-5 rounded-lg border border-red-700 p-3 text-sm text-red-700 sm:mx-7">{deliveryError}</p>}
        {/* Actions */}
        <div className="flex items-center justify-between gap-3 border-t border-mist-200 px-5 py-4 sm:px-7">
          {step > 0 ? (
            <button
              type="button"
              onClick={() => goTo(step - 1)}
              disabled={sending}
              className="rounded-xl px-4 py-3 text-sm font-semibold text-charcoal-500 transition hover:bg-mist-100 hover:text-navy-900 disabled:opacity-50"
            >
              ← Back
            </button>
          ) : (
            <span className="text-xs text-charcoal-500">Free estimate · no obligation</span>
          )}

          <button
            type="submit"
            disabled={sending || preparingPhotos}
            className="group inline-flex items-center gap-2 rounded-xl bg-accent-500 px-5 py-3.5 text-base font-bold text-white shadow-sm transition hover:bg-accent-600 active:bg-accent-700 disabled:cursor-wait disabled:opacity-80"
          >
            {sending
              ? progress !== null && progress < 100 ? `Uploading… ${progress}%` : "Sending…"
              : step === STEPS.length - 1 ? (DEMO_MODE && !API_ENABLED ? "Preview request" : "Send request") : "Continue"}
            {!sending && <IconArrow className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />}
          </button>
        </div>
        {step === STEPS.length - 1 && <PrivacyNote className="px-5 pb-4 text-right sm:px-7" />}
      </form>
    </div>
  );
}

/* ------------------------------------------------------------------ bits */

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex gap-4">
      <dt className="w-[86px] shrink-0 text-charcoal-500">{k}</dt>
      <dd className="min-w-0 break-words font-medium text-navy-900 [overflow-wrap:anywhere]">{v}</dd>
    </div>
  );
}

/** A labelled group of radios or checkboxes. */
function Group({
  legend,
  hint,
  error,
  errorId,
  children,
}: {
  legend: string;
  hint?: string;
  error?: string;
  errorId?: string;
  children: ReactNode;
}) {
  return (
    <fieldset aria-describedby={errorId} aria-invalid={!!error}>
      <legend className="mb-2 flex flex-wrap items-baseline gap-x-2 text-sm font-semibold text-navy-900">
        {legend}
        {hint && <span className="text-xs font-normal text-charcoal-500">{hint}</span>}
      </legend>
      {children}
      {error && (
        <p id={errorId} role="alert" className={errorClass}>
          {error}
        </p>
      )}
    </fieldset>
  );
}

function Field({
  id,
  label,
  value,
  onChange,
  name,
  autoComplete,
  type = "text",
  optional,
  error,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  name: string;
  autoComplete: string;
  type?: string;
  optional?: boolean;
  error?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className={labelClass}>
        {label} {optional && <span className="font-normal text-charcoal-500">(optional)</span>}
      </label>
      <input
        id={id}
        type={type}
        name={name}
        autoComplete={autoComplete}
        required={!optional}
        inputMode={type === "tel" ? "tel" : undefined}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        className={inputClass}
      />
      {error && (
        <p id={`${id}-error`} className={errorClass}>
          {error}
        </p>
      )}
    </div>
  );
}

function Choice({
  id,
  type,
  name,
  label,
  checked,
  onChange,
  compact,
}: {
  id?: string;
  type: "radio" | "checkbox";
  name: string;
  label: string;
  checked: boolean;
  onChange: () => void;
  compact?: boolean;
}) {
  return (
    <label
      className={`flex cursor-pointer items-center gap-3 rounded-xl border text-sm font-medium transition has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-accent-500 ${
        compact ? "px-3 py-2.5" : "px-4 py-3"
      } ${
        checked
          ? "border-accent-500 bg-accent-500/10 text-navy-900"
          : "border-mist-200 text-charcoal-700 hover:border-navy-200 hover:bg-mist-50"
      }`}
    >
      <input id={id} type={type} name={name} checked={checked} onChange={onChange} className="sr-only" />
      <span
        className={`flex h-[18px] w-[18px] shrink-0 items-center justify-center border transition-colors ${
          type === "radio" ? "rounded-full" : "rounded-[4px]"
        } ${checked ? "border-accent-500 bg-accent-500" : "border-navy-400 bg-white"}`}
        aria-hidden="true"
      >
        {checked &&
          (type === "radio" ? (
            <span className="h-[6px] w-[6px] rounded-full bg-white" />
          ) : (
            <IconCheck className="h-3 w-3 text-white" />
          ))}
      </span>
      <span>{label}</span>
    </label>
  );
}

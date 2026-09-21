"use client";

import { useMemo, useRef, useState } from "react";
import { services } from "@/lib/services";
import { towns } from "@/lib/areas";
import { DEMO_MODE, PHONE_MA, PHONE_NH } from "@/lib/site";
import { IconArrow, IconCheck, IconPhone } from "./icons";

const STEPS = ["What you need", "The property", "Location", "Your details"];

const conditions = [
  "Active leak or water stain",
  "Missing or lifted shingles",
  "Ice dams in winter",
  "Storm or fallen limb damage",
  "Moss, streaking or granule loss",
  "Nothing visible — routine check",
];

const estimateTypes = [
  "Remote — from photos (fastest)",
  "In-person visit",
  "Whatever you recommend",
];

const insuranceOptions = ["Yes", "No", "Not sure yet"];

const roofAges = [
  "Under 10 years",
  "10 – 15 years",
  "15 – 20 years",
  "Over 20 years",
  "Not sure",
];

type Data = {
  service: string;
  propertyType: string;
  roofAge: string;
  conditions: string[];
  estimateType: string;
  insurance: string;
  photos: string[];
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

export function EstimateForm() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<Data>(empty);
  const [done, setDone] = useState(false);
  const shell = useRef<HTMLDivElement>(null);

  const set = <K extends keyof Data>(k: K, v: Data[K]) =>
    setData((d) => ({ ...d, [k]: v }));

  /**
   * Steps differ a lot in height, so advancing can leave the card partly
   * off-screen. Pull it back into view whenever the step changes.
   */
  const goTo = (next: number | "done") => {
    if (next === "done") setDone(true);
    else setStep(next);

    const el = shell.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top;
    if (top < 80 || top > window.innerHeight * 0.5) {
      window.scrollTo({
        top: window.scrollY + top - 110,
        behavior: "smooth",
      });
    }
  };

  const selectedTown = useMemo(
    () => towns.find((t) => `${t.name}, ${t.state}` === data.town),
    [data.town],
  );
  const phone = selectedTown?.state === "MA" ? PHONE_MA : PHONE_NH;

  const canAdvance =
    (step === 0 && data.service !== "") ||
    (step === 1 && data.roofAge !== "") ||
    (step === 2 && data.town !== "") ||
    (step === 3 && data.name !== "" && data.phone !== "");

  if (done) {
    return (
      <div
        ref={shell}
        className="rounded-2xl bg-white p-6 shadow-xl ring-1 ring-mist-200 sm:p-8"
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent-500/10">
          <IconCheck className="h-6 w-6 text-accent-600" />
        </div>
        <h3 className="mt-5 text-xl font-bold text-navy-900">That is everything we need</h3>
        {DEMO_MODE ? (
          <>
            <p className="mt-3 text-sm leading-relaxed text-charcoal-500 sm:text-base">
              This is a preview of the site, so the form is not connected to an
              inbox yet. Once the business email and hosting are set up, a
              submission like this one lands in your inbox and as a text
              message within seconds.
            </p>
            <div className="mt-6 rounded-xl bg-mist-50 p-5 ring-1 ring-mist-200">
              <p className="mb-3 text-xs font-bold uppercase tracking-wider text-charcoal-500">
                What would have been sent
              </p>
              <dl className="space-y-2 text-sm">
                <Row k="Service" v={data.service} />
                <Row k="Property" v={data.propertyType} />
                <Row k="Roof age" v={data.roofAge} />
                <Row
                  k="Seeing"
                  v={data.conditions.join(", ") || "Not specified"}
                />
                <Row k="Estimate" v={data.estimateType} />
                <Row k="Insurance" v={data.insurance} />
                {data.photos.length > 0 && (
                  <Row k="Photos" v={`${data.photos.length} attached`} />
                )}
                <Row k="Location" v={data.town} />
                {data.address && <Row k="Address" v={data.address} />}
                <Row k="Name" v={data.name} />
                <Row k="Phone" v={data.phone} />
                {data.email && <Row k="Email" v={data.email} />}
                <Row k="Best time" v={data.best} />
                {data.notes && <Row k="Notes" v={data.notes} />}
              </dl>
            </div>
          </>
        ) : (
          <p className="mt-3 text-sm leading-relaxed text-charcoal-500 sm:text-base">
            Thank you. We will call you back within one business day to go
            over your estimate.
          </p>
        )}

        <div className="mt-7 flex flex-wrap items-center gap-3">
          <a
            href={phone.href}
            className="inline-flex items-center gap-2 rounded-xl bg-accent-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-accent-600"
          >
            <IconPhone className="h-4 w-4" />
            Call {phone.display}
          </a>
          <button
            type="button"
            onClick={() => {
              setDone(false);
              setStep(0);
              setData(empty);
            }}
            className="text-sm font-semibold text-navy-600 underline underline-offset-4 hover:text-navy-900"
          >
            Start over
          </button>
        </div>
      </div>
    );
  }

  return (
    <div ref={shell} className="rounded-2xl bg-white shadow-xl ring-1 ring-mist-200">
      {/* Progress */}
      <div className="px-5 pt-6 sm:px-7">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="text-lg font-bold text-navy-900 sm:text-xl">{STEPS[step]}</h3>
          <span className="shrink-0 text-xs font-semibold uppercase tracking-wider text-charcoal-500">
            Step {step + 1} of {STEPS.length}
          </span>
        </div>
        {DEMO_MODE && (
          <p className="mt-2 text-xs leading-relaxed text-charcoal-500">
            Preview form — not connected yet.{" "}
            <a
              href={PHONE_NH.href}
              className="font-semibold text-navy-600 underline underline-offset-2"
            >
              Call {PHONE_NH.display}
            </a>{" "}
            to make an enquiry now.
          </p>
        )}
        <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-mist-200" aria-hidden="true">
          <div
            className="h-full rounded-full bg-accent-500 transition-[width] duration-500 ease-out"
            style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="px-5 py-6 sm:px-7">
        {step === 0 && (
          <fieldset>
            <legend className="sr-only">What do you need?</legend>
            <div className="grid gap-2">
              {services.map((s) => (
                <Choice
                  key={s.slug}
                  type="radio"
                  name="service"
                  label={s.name}
                  checked={data.service === s.name}
                  onChange={() => set("service", s.name)}
                />
              ))}
            </div>
          </fieldset>
        )}

        {step === 1 && (
          <div className="space-y-6">
            <div>
              <Label>Property type</Label>
              <div className="grid grid-cols-2 gap-2">
                {["Residential", "Commercial"].map((t) => (
                  <Choice
                    key={t}
                    type="radio"
                    name="propertyType"
                    label={t}
                    checked={data.propertyType === t}
                    onChange={() => set("propertyType", t)}
                  />
                ))}
              </div>
            </div>
            <div>
              <Label>Roughly how old is the roof?</Label>
              <div className="grid gap-2 sm:grid-cols-2">
                {roofAges.map((a) => (
                  <Choice
                    key={a}
                    type="radio"
                    name="roofAge"
                    label={a}
                    checked={data.roofAge === a}
                    onChange={() => set("roofAge", a)}
                  />
                ))}
              </div>
            </div>
            <div>
              <Label>
                What are you seeing?{" "}
                <span className="text-xs font-normal text-charcoal-500">
                  Select any that apply
                </span>
              </Label>
              <div className="grid gap-2 sm:grid-cols-2">
                {conditions.map((c) => (
                  <Choice
                    key={c}
                    type="checkbox"
                    name="conditions"
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
            </div>
            <div>
              <Label>Is this an insurance claim?</Label>
              <div className="grid grid-cols-3 gap-2">
                {insuranceOptions.map((o) => (
                  <Choice
                    key={o}
                    type="radio"
                    name="insurance"
                    label={o}
                    checked={data.insurance === o}
                    onChange={() => set("insurance", o)}
                  />
                ))}
              </div>
            </div>
            <div>
              <Label>How would you like your estimate?</Label>
              <div className="grid gap-2">
                {estimateTypes.map((o) => (
                  <Choice
                    key={o}
                    type="radio"
                    name="estimateType"
                    label={o}
                    checked={data.estimateType === o}
                    onChange={() => set("estimateType", o)}
                  />
                ))}
              </div>
            </div>
            <div>
              <Label>
                Photos of the roof{" "}
                <span className="text-xs font-normal text-charcoal-500">
                  Optional — speeds up a remote estimate
                </span>
              </Label>
              <label className="flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-dashed border-mist-300 px-4 py-3.5 text-sm text-charcoal-500 transition hover:border-navy-400">
                <span>
                  {data.photos.length > 0
                    ? `${data.photos.length} photo${data.photos.length === 1 ? "" : "s"} selected`
                    : "Add photos from your phone or computer"}
                </span>
                <span className="shrink-0 font-semibold text-accent-600">Browse</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="sr-only"
                  onChange={(e) =>
                    set(
                      "photos",
                      Array.from(e.target.files ?? []).map((f) => f.name),
                    )
                  }
                />
              </label>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5">
            <div>
              <Label>Town</Label>
              <select
                value={data.town}
                onChange={(e) => set("town", e.target.value)}
                className={`${inputClass} appearance-none bg-no-repeat pr-10`}
                style={{ backgroundImage: CHEVRON, backgroundPosition: "right 0.9rem center", backgroundSize: "1.1rem" }}
              >
                <option value="">Select your town…</option>
                <optgroup label="New Hampshire">
                  {towns
                    .filter((t) => t.state === "NH")
                    .map((t) => (
                      <option key={t.name} value={`${t.name}, NH`}>
                        {t.name}, NH
                      </option>
                    ))}
                </optgroup>
                <optgroup label="Massachusetts">
                  {towns
                    .filter((t) => t.state === "MA")
                    .map((t) => (
                      <option key={t.name} value={`${t.name}, MA`}>
                        {t.name}, MA
                      </option>
                    ))}
                </optgroup>
                <option value="Outside this list">
                  My town is not on this list
                </option>
              </select>
              {data.town === "Outside this list" && (
                <p className="mt-2.5 text-sm leading-relaxed text-charcoal-500">
                  Give us a call anyway — we will tell you honestly whether we
                  can get to you, and recommend someone if we cannot.
                </p>
              )}
            </div>
            <Field
              label="Street address"
              optional
              value={data.address}
              onChange={(v) => set("address", v)}
              placeholder="12 Maple Street"
            />
          </div>
        )}

        {step === 3 && (
          <div className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field
                label="Full name"
                value={data.name}
                onChange={(v) => set("name", v)}
                placeholder="Jane Doe"
              />
              <Field
                label="Phone"
                type="tel"
                value={data.phone}
                onChange={(v) => set("phone", v)}
                placeholder="(603) 555-0142"
              />
            </div>
            <Field
              label="Email"
              optional
              type="email"
              value={data.email}
              onChange={(v) => set("email", v)}
              placeholder="jane@example.com"
            />
            <div>
              <Label>Best time to reach you</Label>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {["Anytime", "Morning", "Afternoon", "Evening"].map((t) => (
                  <Choice
                    key={t}
                    type="radio"
                    name="best"
                    label={t}
                    compact
                    checked={data.best === t}
                    onChange={() => set("best", t)}
                  />
                ))}
              </div>
            </div>
            <div>
              <Label optional>Anything else we should know</Label>
              <textarea
                rows={3}
                value={data.notes}
                onChange={(e) => set("notes", e.target.value)}
                placeholder="Gate code, dog in the yard, when the leak started…"
                className={`${inputClass} resize-y`}
              />
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between gap-3 border-t border-mist-200 px-5 py-4 sm:px-7">
        {step > 0 ? (
          <button
            type="button"
            onClick={() => goTo(step - 1)}
            className="rounded-xl px-4 py-3 text-sm font-semibold text-charcoal-500 transition hover:bg-mist-100 hover:text-navy-900"
          >
            ← Back
          </button>
        ) : (
          <span className="text-xs text-charcoal-500">
            Free inspection · no obligation
          </span>
        )}

        <button
          type="button"
          disabled={!canAdvance}
          onClick={() =>
            goTo(step === STEPS.length - 1 ? "done" : step + 1)
          }
          className="group inline-flex items-center gap-2 rounded-xl bg-accent-500 px-5 py-3.5 text-base font-bold text-white shadow-sm transition hover:bg-accent-600 active:bg-accent-700 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-accent-500"
        >
          {step === STEPS.length - 1 ? "Send request" : "Continue"}
          <IconArrow className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-disabled:translate-x-0" />
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ bits */

const inputClass =
  "w-full rounded-xl border border-mist-300 bg-white px-4 py-3 text-base text-charcoal-900 " +
  "placeholder:text-charcoal-500/60 transition focus:border-navy-600 focus:outline-none " +
  "focus:ring-2 focus:ring-navy-600/20";

const CHEVRON =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%234b5563' stroke-width='2.5' stroke-linecap='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")";

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex gap-4">
      <dt className="w-[86px] shrink-0 text-charcoal-500">{k}</dt>
      <dd className="font-medium text-navy-900">{v}</dd>
    </div>
  );
}

function Label({
  children,
  optional,
}: {
  children: React.ReactNode;
  optional?: boolean;
}) {
  return (
    <label className="mb-2 flex flex-wrap items-baseline gap-x-2 text-sm font-semibold text-navy-900">
      {children}
      {optional && <span className="text-xs font-normal text-charcoal-500">Optional</span>}
    </label>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  optional,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  optional?: boolean;
}) {
  return (
    <div>
      <Label optional={optional}>{label}</Label>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={inputClass}
      />
    </div>
  );
}

function Choice({
  type,
  name,
  label,
  checked,
  onChange,
  compact,
}: {
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
      <input
        type={type}
        name={name}
        checked={checked}
        onChange={onChange}
        className="sr-only"
      />
      <span
        className={`flex h-[18px] w-[18px] shrink-0 items-center justify-center border transition-colors ${
          type === "radio" ? "rounded-full" : "rounded-[5px]"
        } ${checked ? "border-accent-500 bg-accent-500" : "border-mist-300 bg-white"}`}
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

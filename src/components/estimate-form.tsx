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
        className="rounded-[4px] border border-ink/10 bg-white p-8 md:p-10"
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-copper-50">
          <IconCheck className="h-6 w-6 text-copper-600" />
        </div>
        <h3 className="mt-6 text-[22px] text-ink">That is everything we need</h3>
        {DEMO_MODE ? (
          <>
            <p className="mt-4 text-[14.5px] leading-[1.75] text-stone-700">
              This is a preview of the site, so the form is not connected to an
              inbox yet. Once the business email and hosting are set up, a
              submission like this one lands in your inbox and as a text
              message within seconds.
            </p>
            <div className="mt-6 rounded-[3px] border border-ink/10 bg-paper p-5">
              <p className="eyebrow mb-4 text-stone-500">
                What would have been sent
              </p>
              <dl className="space-y-2 text-[13px]">
                <Row k="Service" v={data.service} />
                <Row k="Property" v={data.propertyType} />
                <Row k="Roof age" v={data.roofAge} />
                <Row
                  k="Seeing"
                  v={data.conditions.join(", ") || "Not specified"}
                />
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
          <p className="mt-4 text-[14.5px] leading-[1.75] text-stone-700">
            Thank you. We will call you back to confirm the details and book a
            time for the inspection.
          </p>
        )}

        <div className="mt-7 flex flex-wrap items-center gap-3">
          <a
            href={phone.href}
            className="inline-flex h-12 items-center gap-2 rounded-[3px] bg-navy-900 px-6 font-display text-[13.5px] font-bold text-white hover:bg-ink"
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
            className="font-display text-[13px] font-bold text-stone-500 hover:text-ink"
          >
            Start over
          </button>
        </div>
      </div>
    );
  }

  return (
    <div ref={shell} className="rounded-[4px] border border-ink/10 bg-white">
      {/* Progress */}
      <div className="border-b border-ink/8 px-6 pb-5 pt-6 md:px-8">
        <div className="flex items-baseline justify-between gap-4">
          <h3 className="text-[19px] text-ink">{STEPS[step]}</h3>
          <span className="eyebrow shrink-0 text-stone-500">
            Step {step + 1} of {STEPS.length}
          </span>
        </div>
        {DEMO_MODE && (
          <p className="mt-2 text-[12px] text-stone-500">
            Preview form — not connected yet.{" "}
            <a
              href={PHONE_NH.href}
              className="font-semibold text-copper-600 hover:underline"
            >
              Call {PHONE_NH.display}
            </a>{" "}
            to make an enquiry now.
          </p>
        )}
        <div className="mt-4 h-[3px] w-full overflow-hidden rounded-full bg-ink/8">
          <div
            className="h-full rounded-full bg-copper-500 transition-[width] duration-500 ease-out"
            style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="px-6 py-7 md:px-8">
        {step === 0 && (
          <fieldset>
            <legend className="sr-only">What do you need?</legend>
            <div className="space-y-2.5">
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
          <div className="space-y-7">
            <div>
              <Label>Property type</Label>
              <div className="grid grid-cols-2 gap-2.5">
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
              <div className="grid gap-2.5 sm:grid-cols-2">
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
                <span className="font-normal normal-case tracking-normal text-stone-500">
                  Select any that apply
                </span>
              </Label>
              <div className="grid gap-2.5 sm:grid-cols-2">
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
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div>
              <Label>Town</Label>
              <select
                value={data.town}
                onChange={(e) => set("town", e.target.value)}
                className="h-12 w-full rounded-[3px] border border-ink/15 bg-white px-3.5 text-[14.5px] text-ink outline-none transition-colors focus:border-navy-600"
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
                <p className="mt-2.5 text-[12.5px] leading-relaxed text-stone-600">
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
          <div className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
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
              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
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
                className="w-full resize-y rounded-[3px] border border-ink/15 px-3.5 py-3 text-[14.5px] text-ink outline-none transition-colors placeholder:text-stone-300 focus:border-navy-600"
              />
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between gap-4 border-t border-ink/8 px-6 py-5 md:px-8">
        {step > 0 ? (
          <button
            type="button"
            onClick={() => goTo(step - 1)}
            className="font-display text-[13px] font-bold text-stone-500 transition-colors hover:text-ink"
          >
            ← Back
          </button>
        ) : (
          <span className="text-[12px] text-stone-500">
            Free inspection · no obligation
          </span>
        )}

        <button
          type="button"
          disabled={!canAdvance}
          onClick={() =>
            goTo(step === STEPS.length - 1 ? "done" : step + 1)
          }
          className="group inline-flex h-12 items-center gap-2 rounded-[3px] bg-copper-600 px-7 font-display text-[13.5px] font-bold text-white transition-colors hover:bg-copper-700 disabled:cursor-not-allowed disabled:bg-ink/15 disabled:text-ink/35"
        >
          {step === STEPS.length - 1 ? "Send request" : "Continue"}
          <IconArrow className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-disabled:translate-x-0" />
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ bits */

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex gap-4">
      <dt className="w-[86px] shrink-0 text-stone-500">{k}</dt>
      <dd className="font-medium text-ink">{v}</dd>
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
    <label className="mb-3 block font-display text-[11.5px] font-bold uppercase tracking-[0.14em] text-stone-700">
      {children}
      {optional && (
        <span className="ml-2 font-normal normal-case tracking-normal text-stone-500">
          optional
        </span>
      )}
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
        className="h-12 w-full rounded-[3px] border border-ink/15 px-3.5 text-[14.5px] text-ink outline-none transition-colors placeholder:text-stone-300 focus:border-navy-600"
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
      className={`flex cursor-pointer items-center gap-3 rounded-[3px] border transition-colors ${
        compact ? "px-3 py-2.5" : "px-4 py-3.5"
      } ${
        checked
          ? "border-copper-500 bg-copper-50"
          : "border-ink/12 hover:border-ink/30"
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
          type === "radio" ? "rounded-full" : "rounded-[2px]"
        } ${checked ? "border-copper-500 bg-copper-500" : "border-ink/25"}`}
      >
        {checked &&
          (type === "radio" ? (
            <span className="h-[6px] w-[6px] rounded-full bg-white" />
          ) : (
            <IconCheck className="h-3 w-3 text-white" />
          ))}
      </span>
      <span className="text-[14px] text-ink">{label}</span>
    </label>
  );
}

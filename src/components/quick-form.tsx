"use client";

import { SiteLink as Link } from "./site-link";
import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { DEMO_MODE, PHONE_NH } from "@/lib/site";
import { IconArrow, IconCheck } from "./icons";
import { Button } from "./ui";
import { errorClass, inputClass, isPhone, labelClass, selectStyle } from "./form-styles";

type Errors = { name?: string; phone?: string };

/**
 * Compact hero card. Deliberately short — name, phone, town — because the
 * job of this form is to start a conversation, not to qualify the lead.
 * The full multi-step version lives on /free-estimate.
 */
export function QuickForm() {
  const id = useId();
  const [sent, setSent] = useState(false);
  const [v, setV] = useState({ name: "", phone: "", town: "", need: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [deliveryError, setDeliveryError] = useState("");
  const message = useRef<HTMLParagraphElement>(null);
  const confirmation = useRef<HTMLHeadingElement>(null);
  useEffect(() => { if (deliveryError) message.current?.focus(); }, [deliveryError]);
  useEffect(() => { if (sent) confirmation.current?.focus(); }, [sent]);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const next: Errors = {
      name: v.name.trim() ? undefined : "Please add your name.",
      phone: isPhone(v.phone) ? undefined : "Please add a phone number we can call back.",
    };
    setErrors(next);
    const firstBad = next.name ? "name" : next.phone ? "phone" : null;
    if (firstBad) {
      document.getElementById(`${id}-${firstBad}`)?.focus();
      return;
    }
    if (!DEMO_MODE) {
      setDeliveryError("Your request has not been sent. Please call to arrange an estimate; online requests are not connected yet.");
      return;
    }
    setSent(true);
  };

  if (sent) {
    return (
      <div className="w-full rounded-2xl bg-white p-5 shadow-xl ring-1 ring-mist-200 sm:p-7" role="status">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent-500/10">
          <IconCheck className="h-6 w-6 text-accent-600" />
        </div>
        <h2 ref={confirmation} tabIndex={-1} className="mt-5 text-xl font-bold text-navy-900">Preview complete. Nothing was sent.</h2>
        <p className="mt-2 text-sm leading-relaxed text-charcoal-500">
          Your details have not been sent or saved. Please call to arrange an estimate.
        </p>
        <Button href={PHONE_NH.href} className="mt-5">
          Call {PHONE_NH.display}
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full rounded-2xl bg-white p-5 shadow-xl ring-1 ring-mist-200 sm:p-7">
      <h2 className="text-lg font-bold text-navy-900 sm:text-xl">Get a free estimate</h2>
      <p className="mt-1.5 text-sm leading-relaxed text-charcoal-500">
        Tell us the basics. We call back within one business day, and many
        estimates need no visit at all.
      </p>

      <form className="mt-5 grid gap-3.5" onSubmit={submit} noValidate>
        <p className="sr-only" role="alert">{Object.values(errors).filter(Boolean).join(" ")}</p>
        <div>
          <label htmlFor={`${id}-name`} className={labelClass}>
            Full name
          </label>
          <input
            id={`${id}-name`}
            name="name"
            required
            value={v.name}
            onChange={(e) => setV({ ...v, name: e.target.value })}
            autoComplete="name"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? `${id}-name-error` : undefined}
            className={inputClass}
          />
          {errors.name && (
            <p id={`${id}-name-error`} className={errorClass}>
              {errors.name}
            </p>
          )}
        </div>
        <div>
          <label htmlFor={`${id}-phone`} className={labelClass}>
            Phone number
          </label>
          <input
            id={`${id}-phone`}
            name="phone"
            required
            type="tel"
            inputMode="tel"
            value={v.phone}
            onChange={(e) => setV({ ...v, phone: e.target.value })}
            autoComplete="tel"
            aria-invalid={!!errors.phone}
            aria-describedby={errors.phone ? `${id}-phone-error` : undefined}
            className={inputClass}
          />
          {errors.phone && (
            <p id={`${id}-phone-error`} className={errorClass}>
              {errors.phone}
            </p>
          )}
        </div>
        <div className="grid gap-3.5 sm:grid-cols-2">
          <div>
            <label htmlFor={`${id}-town`} className={labelClass}>
              Town <span className="font-normal text-charcoal-500">(optional)</span>
            </label>
            <input
              id={`${id}-town`}
              name="town"
              value={v.town}
              onChange={(e) => setV({ ...v, town: e.target.value })}
              autoComplete="address-level2"
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor={`${id}-need`} className={labelClass}>
              What you need
            </label>
            <select
              id={`${id}-need`}
              name="need"
              value={v.need}
              onChange={(e) => setV({ ...v, need: e.target.value })}
              className={`${inputClass} appearance-none pr-10`}
              style={selectStyle}
            >
              <option value="">Not sure yet</option>
              <option>Roof replacement</option>
              <option>Roof repair or leak</option>
              <option>Storm damage / insurance claim</option>
              <option>Inspection only</option>
              <option>Something else</option>
            </select>
          </div>
        </div>

        {deliveryError && <p ref={message} tabIndex={-1} role="alert" className="rounded-lg border border-red-700 p-3 text-sm text-red-700">{deliveryError}</p>}
        <button
          type="submit"
          className="group mt-1 flex w-full items-center justify-center gap-2 rounded-xl bg-accent-500 px-5 py-3.5 text-base font-bold text-white shadow-sm transition hover:bg-accent-600 active:bg-accent-700"
        >
          {DEMO_MODE ? "Preview estimate request" : "Request my free estimate"}
          <IconArrow className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </button>
      </form>

      <p className="mt-4 border-t border-mist-200 pt-4 text-xs leading-relaxed text-charcoal-500">
        <span className="mr-1 font-semibold">{DEMO_MODE ? "Preview form, not connected yet." : "Online requests are not available yet."}</span>
        Prefer to talk?{" "}
        <a href={PHONE_NH.href} className="font-semibold text-accent-600 underline underline-offset-2">
          {PHONE_NH.display}
        </a>{" "}
        ·{" "}
        <Link href="/free-estimate" className="font-semibold text-accent-600 underline underline-offset-2">
          Longer form with photos
        </Link>
      </p>
    </div>
  );
}

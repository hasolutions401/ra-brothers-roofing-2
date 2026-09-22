"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { SiteLink as Link } from "@/components/site-link";
import { Logo } from "@/components/icons";
import { errorClass, inputClass, labelClass } from "@/components/form-styles";
import { API_ENABLED, toProblem } from "@/lib/api";
import { useAdminAuth } from "./admin-auth";
import { useQueryParam } from "./use-query-param";

/** Only ever return to a dashboard page, never to another site. */
function safeNext(value: string | null) {
  return value && value.startsWith("/admin/") && !value.startsWith("//") && !value.includes("\\") ? value : "/admin/";
}

export function LoginScreen() {
  const id = useId();
  const auth = useAdminAuth();
  const router = useRouter();
  const next = safeNext(useQueryParam("next"));
  const expiredParam = useQueryParam("expired");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const noticeRef = useRef<HTMLParagraphElement>(null);

  const expired = expiredParam === "1" || (auth.status === "signed-out" && auth.expired);

  useEffect(() => {
    if (auth.status === "signed-in") router.replace(next);
  }, [auth.status, next, router]);

  useEffect(() => {
    if (notice) noticeRef.current?.focus();
  }, [notice]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const found = {
      email: email.trim() ? undefined : "Enter your email address.",
      password: password ? undefined : "Enter your password.",
    };
    setErrors(found);
    setNotice("");
    if (found.email || found.password) {
      document.getElementById(`${id}-${found.email ? "email" : "password"}`)?.focus();
      return;
    }

    setBusy(true);
    try {
      await auth.signIn(email, password);
      // The effect above moves on to the dashboard.
    } catch (error) {
      const problem = toProblem(error);
      setPassword("");
      if (problem.kind === "validation") {
        setErrors({ email: problem.fields.email, password: problem.fields.password });
        document.getElementById(`${id}-email`)?.focus();
      } else {
        setNotice(problem.message);
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex min-h-full flex-1 items-center justify-center bg-navy-950 px-4 py-12">
      <div className="w-full max-w-sm">
        <Link href="/" className="mx-auto flex w-fit text-white" aria-label="Back to the website">
          <Logo />
        </Link>

        <div className="mt-8 rounded-2xl bg-white p-6 shadow-xl sm:p-8">
          <h1 className="text-xl font-bold text-navy-900">Sign in to the dashboard</h1>
          <p className="mt-1.5 text-sm leading-relaxed text-charcoal-500">
            For RA Brothers staff. Customers do not need an account.
          </p>

          {!API_ENABLED ? (
            <p className="mt-6 rounded-lg bg-mist-50 p-4 text-sm leading-relaxed text-charcoal-700 ring-1 ring-mist-200">
              This copy of the website is a preview without the server, so the
              dashboard is not available here.
            </p>
          ) : (
            <form className="mt-6 grid gap-4" onSubmit={submit} noValidate aria-busy={busy}>
              {expired && !notice && (
                <p role="status" className="rounded-lg bg-accent-500/10 p-3 text-sm text-navy-900">
                  Your session ended. Please sign in again.
                </p>
              )}
              <div>
                <label htmlFor={`${id}-email`} className={labelClass}>Email</label>
                <input
                  id={`${id}-email`}
                  type="email"
                  name="email"
                  autoComplete="username"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? `${id}-email-error` : undefined}
                  className={inputClass}
                />
                {errors.email && <p id={`${id}-email-error`} className={errorClass}>{errors.email}</p>}
              </div>
              <div>
                <label htmlFor={`${id}-password`} className={labelClass}>Password</label>
                <input
                  id={`${id}-password`}
                  type="password"
                  name="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  aria-invalid={!!errors.password}
                  aria-describedby={errors.password ? `${id}-password-error` : undefined}
                  className={inputClass}
                />
                {errors.password && <p id={`${id}-password-error`} className={errorClass}>{errors.password}</p>}
              </div>
              {notice && (
                <p ref={noticeRef} tabIndex={-1} role="alert" className="rounded-lg border border-red-700 p-3 text-sm text-red-700">
                  {notice}
                </p>
              )}
              <button
                type="submit"
                disabled={busy || auth.status === "checking"}
                className="mt-1 w-full rounded-xl bg-accent-500 px-5 py-3.5 text-base font-bold text-white shadow-sm transition hover:bg-accent-600 active:bg-accent-700 disabled:cursor-wait disabled:opacity-80"
              >
                {busy ? "Signing in…" : "Sign in"}
              </button>
            </form>
          )}
        </div>

        <p className="mt-6 text-center text-sm">
          <Link href="/" className="font-semibold text-navy-200 underline underline-offset-4 hover:text-white">
            Back to the website
          </Link>
        </p>
      </div>
    </div>
  );
}

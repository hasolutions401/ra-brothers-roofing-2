"use client";

import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { SiteLink as Link } from "@/components/site-link";
import { Logo } from "@/components/icons";
import { useAdminAuth } from "./admin-auth";

/** Navy top bar and page frame for the signed-in dashboard. */
export function AdminShell({ title, actions, children }: { title: string; actions?: ReactNode; children: ReactNode }) {
  const auth = useAdminAuth();
  const router = useRouter();

  return (
    <div className="flex min-h-full flex-1 flex-col bg-mist-50">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-white focus:px-4 focus:py-3 focus:font-bold focus:text-navy-900"
      >
        Skip to content
      </a>
      <header className="bg-navy-900 text-white">
        <div className="wrap flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/" aria-label="View the website" className="text-white">
              <Logo />
            </Link>
            <span className="rounded-lg bg-white/10 px-2 py-1 text-xs font-bold uppercase tracking-wider text-navy-100">
              Admin
            </span>
          </div>
          {auth.status === "signed-in" && (
            <div className="flex items-center gap-2 text-sm sm:gap-4">
              <span className="hidden text-navy-200 md:inline" title={auth.user.email}>
                {auth.user.name}
              </span>
              <Link href="/" className="hidden rounded-lg px-3 py-2 font-semibold text-navy-100 transition hover:bg-white/10 sm:inline-block">
                View site
              </Link>
              <button
                type="button"
                onClick={async () => {
                  await auth.signOut().catch(() => undefined);
                  router.replace("/admin/login/");
                }}
                className="rounded-lg border border-white/30 px-3 py-2 font-semibold text-white transition hover:bg-white/10"
              >
                Sign out
              </button>
            </div>
          )}
        </div>
      </header>

      <main id="main" tabIndex={-1} className="wrap flex-1 py-6 outline-none sm:py-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h1 className="text-2xl font-extrabold tracking-tight text-navy-900 sm:text-3xl">{title}</h1>
          {actions}
        </div>
        {children}
      </main>
    </div>
  );
}

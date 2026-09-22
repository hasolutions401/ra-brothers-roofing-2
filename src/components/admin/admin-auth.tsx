"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { API_ENABLED } from "@/lib/api";
import { adminApi, onSessionEnded, type AdminUser } from "@/lib/admin-api";

type AuthState =
  | { status: "checking"; user: null }
  | { status: "signed-in"; user: AdminUser }
  | { status: "signed-out"; user: null; expired: boolean };

type AdminAuth = AuthState & {
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const Context = createContext<AdminAuth | null>(null);

/**
 * Who is signed in to the dashboard. The session itself is Laravel's
 * httpOnly cookie; this only mirrors what the API says about it:
 * GET /api/admin/me on load, and "signed out" as soon as any admin request
 * comes back 401 or 419 (session expired or revoked).
 */
export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>(
    API_ENABLED ? { status: "checking", user: null } : { status: "signed-out", user: null, expired: false },
  );

  useEffect(() => {
    if (!API_ENABLED) return;
    let active = true;
    adminApi.me().then(
      (user) => active && setState({ status: "signed-in", user }),
      () => active && setState({ status: "signed-out", user: null, expired: false }),
    );
    const stop = onSessionEnded(() =>
      setState((current) => current.status === "signed-in" ? { status: "signed-out", user: null, expired: true } : current),
    );
    return () => {
      active = false;
      stop();
    };
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const user = await adminApi.login(email, password);
    setState({ status: "signed-in", user });
  }, []);

  const signOut = useCallback(async () => {
    try {
      await adminApi.logout();
    } finally {
      setState({ status: "signed-out", user: null, expired: false });
    }
  }, []);

  const value = useMemo(() => ({ ...state, signIn, signOut }), [state, signIn, signOut]);
  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useAdminAuth() {
  const auth = useContext(Context);
  if (!auth) throw new Error("useAdminAuth must be used inside AdminAuthProvider.");
  return auth;
}

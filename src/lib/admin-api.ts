import { isAxiosError } from "axios";
import { api, API_URL } from "./api";

export type AdminUser = { id: number; name: string; email: string };
export type FormType = "quick" | "estimate";
export type Status = "new" | "read" | "contacted";

export type SubmissionRow = {
  id: number;
  form_type: FormType;
  form_label: string;
  status: Status;
  name: string;
  phone: string;
  email: string | null;
  town: string | null;
  service: string | null;
  photos_count: number;
  created_at: string;
};

export type SubmissionDetail = Omit<SubmissionRow, "photos_count"> & {
  address: string | null;
  message: string | null;
  details: {
    property_type: string;
    roof_age: string;
    conditions: string[];
    insurance: string;
    estimate_type: string;
    best_time: string;
  } | null;
  source_page: string | null;
  ip_address: string | null;
  user_agent: string | null;
  photos: { id: number; path: string; original_name: string; size: number }[];
  read_at: string | null;
  contacted_at: string | null;
};

export type Stats = {
  total: number;
  new: number;
  today: number;
  this_week: number;
  today_date: string;
  week_start_date: string;
  timezone: string;
};

export type Query = {
  search: string;
  form_type: "" | FormType;
  status: "" | Status;
  from: string;
  to: string;
  sort: "created_at" | "name" | "form_type" | "status" | "town" | "service";
  dir: "asc" | "desc";
  page: number;
  per_page: 10 | 25 | 50 | 100;
};

export type Page = {
  data: SubmissionRow[];
  meta: { current_page: number; last_page: number; per_page: number; total: number; from: number | null; to: number | null };
};

/** Query-string parameters without the empty ones. */
function params(query: Partial<Query>) {
  return Object.fromEntries(Object.entries(query).filter(([, value]) => value !== "" && value !== undefined));
}

export const adminApi = {
  /** Sets the XSRF-TOKEN cookie that axios echoes back on writes. */
  csrf: () => api.get("sanctum/csrf-cookie"),

  async login(email: string, password: string): Promise<AdminUser> {
    await adminApi.csrf();
    return (await api.post("admin/login", { email, password })).data.user;
  },

  logout: () => api.post("admin/logout"),

  me: async (): Promise<AdminUser> => (await api.get("admin/me")).data.user,

  stats: async (): Promise<Stats> => (await api.get("admin/stats")).data,

  list: async (query: Query, signal?: AbortSignal): Promise<Page> =>
    (await api.get("admin/submissions", { params: params(query), signal })).data,

  get: async (id: number, signal?: AbortSignal): Promise<SubmissionDetail> =>
    (await api.get(`admin/submissions/${id}`, { signal })).data.data,

  setStatus: async (id: number, status: Status): Promise<SubmissionDetail> =>
    (await api.patch(`admin/submissions/${id}`, { status })).data.data,

  remove: (id: number) => api.delete(`admin/submissions/${id}`),

  /** Downloads the CSV for the current filters through the browser. */
  async exportCsv(query: Query) {
    const filters = params({ ...query, page: undefined, per_page: undefined });
    const response = await api.get("admin/submissions/export", { params: filters, responseType: "blob", timeout: 120_000 });
    const name = /filename="?([^";]+)"?/.exec(response.headers["content-disposition"] ?? "")?.[1] ?? "leads.csv";
    const url = URL.createObjectURL(response.data);
    const link = Object.assign(document.createElement("a"), { href: url, download: name });
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  },

  /** Photos are sent with the session cookie, so a plain <img src> works. */
  photoUrl: (path: string) => `${API_URL}/${path}`,
};

/**
 * Called whenever an admin request comes back 401/419, so the dashboard can
 * send the admin to the sign-in page ("session expired").
 */
export function onSessionEnded(listener: () => void) {
  const id = api.interceptors.response.use(undefined, (error) => {
    const status = isAxiosError(error) ? error.response?.status : undefined;
    const url = isAxiosError(error) ? error.config?.url ?? "" : "";
    if ((status === 401 || status === 419) && url.startsWith("admin/") && url !== "admin/login" && url !== "admin/me") {
      listener();
    }
    return Promise.reject(error);
  });
  return () => api.interceptors.response.eject(id);
}

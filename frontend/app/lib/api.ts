const RAW_BASE =
  process.env.NEXT_PUBLIC_API_URL ?? process.env.NEXT_PUBLIC_API_BASE ?? "";

const BASE = RAW_BASE.replace(/\/$/, "");

function buildUrl(path: string) {
  if (!BASE) throw new Error("❌ Missing NEXT_PUBLIC_API_URL in .env.local");
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${BASE}${normalized}`;
}

export async function apiGet(path: string) {
  return fetch(buildUrl(path), {
    method: "GET",
    credentials: "include",
    headers: {
      Accept: "application/json",
    },
    cache: "no-store",
  });
}

export async function apiPost(path: string, body?: Record<string, unknown>) {
  return fetch(buildUrl(path), {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(body ?? {}),
  });
}

export async function apiPostForm(path: string, form: FormData) {
  return fetch(buildUrl(path), {
    method: "POST",
    credentials: "include",
    headers: {
      Accept: "application/json",
    },
    body: form,
  });
}

export async function apiPatch(path: string, body?: Record<string, unknown>) {
  return fetch(buildUrl(path), {
    method: "PATCH",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(body ?? {}),
  });
}

export async function apiPatchForm(path: string, form: FormData) {
  return fetch(buildUrl(path), {
    method: "PATCH",
    credentials: "include",
    headers: {
      Accept: "application/json",
    },
    body: form,
  });
}

export async function apiDelete(path: string) {
  return fetch(buildUrl(path), {
    method: "DELETE",
    credentials: "include",
    headers: {
      Accept: "application/json",
    },
  });
}

const KEY = "admin_token";

export function setToken(token: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, token);
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(KEY);
}

export function clearToken() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(KEY);
}

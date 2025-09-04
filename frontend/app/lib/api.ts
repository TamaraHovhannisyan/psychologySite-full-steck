const RAW_BASE =
  process.env.NEXT_PUBLIC_API_URL ?? process.env.NEXT_PUBLIC_API_BASE ?? "";

const BASE = RAW_BASE.replace(/\/$/, "");

function buildUrl(path: string) {
  const p = path.startsWith("/") ? path : `/${path}`;
  if (!BASE) throw new Error("NEXT_PUBLIC_API_URL չկա .env.local-ում");
  return `${BASE}${p}`;
}

export function apiGet(path: string, token?: string) {
  return fetch(buildUrl(path), {
    method: "GET",
    headers: {
      Accept: "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    cache: "no-store",
  });
}

export function apiPost(
  path: string,
  body?: Record<string, any>,
  token?: string
) {
  return fetch(buildUrl(path), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body ?? {}),
  });
}

export function apiPostForm(path: string, form: FormData, token?: string) {
  return fetch(buildUrl(path), {
    method: "POST",
    headers: {
      Accept: "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: form, 
  });
}

export function apiPatch(
  path: string,
  body?: Record<string, any>,
  token?: string
) {
  return fetch(buildUrl(path), {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body ?? {}),
  });
}

export function apiPatchForm(path: string, form: FormData, token?: string) {
  return fetch(buildUrl(path), {
    method: "PATCH",
    headers: {
      Accept: "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: form,
  });
}

export function apiDelete(path: string, token?: string) {
  return fetch(buildUrl(path), {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
}

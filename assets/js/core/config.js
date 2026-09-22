import { runtimeConfig } from "../runtime-config.js";

const SESSION_KEY = "biblioteca.session";

function storageValue(storage, key) {
  try {
    return storage.getItem(key);
  } catch {
    return null;
  }
}

function normalizeApiBaseUrl(value) {
  const normalized = String(value ?? "")
    .trim()
    .replace(/\/+$/, "");
  if (!normalized) {
    throw new Error("A URL da API não foi configurada.");
  }

  if (normalized.startsWith("/")) return normalized;

  const url = new URL(normalized);
  if (!new Set(["http:", "https:"]).has(url.protocol)) {
    throw new Error("A URL da API deve usar HTTP ou HTTPS.");
  }

  return url.toString().replace(/\/+$/, "");
}

export function getApiBaseUrl() {
  return normalizeApiBaseUrl(runtimeConfig.apiBaseUrl);
}

export function getAccessToken() {
  const session = getSession();
  if (!session || session.expiresAt <= Date.now()) {
    clearSession();
    return null;
  }
  return session.accessToken;
}

export function getSession() {
  try {
    const value = storageValue(window.sessionStorage, SESSION_KEY);
    if (!value) return null;
    const session = JSON.parse(value);
    return typeof session?.accessToken === "string" && Number.isFinite(session?.expiresAt)
      ? session
      : null;
  } catch {
    return null;
  }
}

export function setSession({ accessToken, expiraEm }) {
  window.sessionStorage.setItem(
    SESSION_KEY,
    JSON.stringify({ accessToken, expiresAt: Date.parse(expiraEm) }),
  );
}

export function clearSession() {
  window.sessionStorage.removeItem(SESSION_KEY);
}

export function getRequestTimeoutMs() {
  return Number.isFinite(runtimeConfig.requestTimeoutMs) &&
    runtimeConfig.requestTimeoutMs > 0
    ? runtimeConfig.requestTimeoutMs
    : 15_000;
}

import { runtimeConfig } from "../runtime-config.js";

const API_URL_OVERRIDE_KEY = "biblioteca.apiBaseUrl";
const ACCESS_TOKEN_KEY = "biblioteca.accessToken";

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
  const override = storageValue(window.localStorage, API_URL_OVERRIDE_KEY);
  return normalizeApiBaseUrl(override || runtimeConfig.apiBaseUrl);
}

export function setApiBaseUrlOverride(value) {
  const normalized = normalizeApiBaseUrl(value);
  window.localStorage.setItem(API_URL_OVERRIDE_KEY, normalized);
  return normalized;
}

export function clearApiBaseUrlOverride() {
  window.localStorage.removeItem(API_URL_OVERRIDE_KEY);
}

export function getAccessToken() {
  return storageValue(window.sessionStorage, ACCESS_TOKEN_KEY)?.trim() || null;
}

export function setAccessToken(value) {
  const normalized = String(value ?? "").trim();
  if (normalized) {
    window.sessionStorage.setItem(ACCESS_TOKEN_KEY, normalized);
  } else {
    window.sessionStorage.removeItem(ACCESS_TOKEN_KEY);
  }
}

export function getRequestTimeoutMs() {
  return Number.isFinite(runtimeConfig.requestTimeoutMs) &&
    runtimeConfig.requestTimeoutMs > 0
    ? runtimeConfig.requestTimeoutMs
    : 15_000;
}

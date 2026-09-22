import {
  getAccessToken,
  getApiBaseUrl,
  getRequestTimeoutMs,
} from "./config.js";

export class ApiError extends Error {
  constructor(message, { status = 0, details = null } = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

function errorMessage(problem, status) {
  const validationMessages = problem?.errors
    ? Object.values(problem.errors).flat().filter(Boolean)
    : [];
  if (validationMessages.length) return validationMessages.join(" ");
  if (problem?.detail) return problem.detail;
  if (problem?.title) return problem.title;
  if (status === 401) return "Sua sessão não é válida para acessar a API.";
  if (status === 403)
    return "Seu usuário não possui permissão para esta operação.";
  return `A API retornou o status HTTP ${status}.`;
}

async function parseResponse(response) {
  if (response.status === 204) return null;
  const contentType = response.headers.get("content-type") ?? "";
  if (contentType.includes("json")) return response.json();
  const text = await response.text();
  return text || null;
}

export async function apiRequest(path, { method = "GET", body } = {}) {
  const controller = new AbortController();
  const timeout = window.setTimeout(
    () => controller.abort(),
    getRequestTimeoutMs(),
  );
  const headers = new Headers({ Accept: "application/json" });
  const token = getAccessToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);
  if (body !== undefined) headers.set("Content-Type", "application/json");

  try {
    const response = await fetch(`${getApiBaseUrl()}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: controller.signal,
      credentials: "omit",
    });
    const payload = await parseResponse(response);
    if (!response.ok) {
      throw new ApiError(errorMessage(payload, response.status), {
        status: response.status,
        details: payload,
      });
    }
    return payload;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (error?.name === "AbortError") {
      throw new ApiError(
        "A API demorou demais para responder. Tente novamente.",
      );
    }
    throw new ApiError(
      "Não foi possível conectar à API. Confira a URL e sua conexão.",
    );
  } finally {
    window.clearTimeout(timeout);
  }
}

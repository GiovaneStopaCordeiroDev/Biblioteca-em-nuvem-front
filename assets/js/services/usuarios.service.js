import { apiRequest } from "../core/api-client.js";

export function getCurrentUser() {
  return apiRequest("/usuarios/me");
}

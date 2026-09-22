import { apiRequest } from "../core/api-client.js";
import { clearSession, setSession } from "../core/config.js";

export async function login(usuario, senha) {
  const response = await apiRequest("/auth/login", {
    method: "POST",
    body: { usuario, senha },
    anonymous: true,
  });
  setSession(response);
  return response.usuario;
}

export async function logout() {
  try {
    await apiRequest("/auth/logout", { method: "POST" });
  } finally {
    clearSession();
  }
}

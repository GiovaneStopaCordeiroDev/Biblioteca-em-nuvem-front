import { apiRequest } from "../core/api-client.js";
import { getApiBaseUrl } from "../core/config.js";
import { showPageMessage } from "../core/feedback.js";

export function initializeSettingsPage() {
  const form = document.querySelector("#connection-form");
  form.elements.apiBaseUrl.value = getApiBaseUrl();

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    try {
      await apiRequest("/dashboard");
      showPageMessage("Conexão com a API validada.", "success");
    } catch (error) {
      showPageMessage(error.message, "error");
    }
  });
}

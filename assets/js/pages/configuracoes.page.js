import { apiRequest } from "../core/api-client.js";
import {
  clearApiBaseUrlOverride,
  getAccessToken,
  getApiBaseUrl,
  setAccessToken,
  setApiBaseUrlOverride,
} from "../core/config.js";
import { showPageMessage } from "../core/feedback.js";

export function initializeSettingsPage() {
  const form = document.querySelector("#connection-form");
  form.elements.apiBaseUrl.value = getApiBaseUrl();
  form.elements.accessToken.value = getAccessToken() ?? "";

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const previousApiBaseUrl = getApiBaseUrl();
    const previousAccessToken = getAccessToken();
    try {
      setApiBaseUrlOverride(form.elements.apiBaseUrl.value);
      setAccessToken(form.elements.accessToken.value);
      await apiRequest("/dashboard");
      showPageMessage("Configuração salva e conexão validada.", "success");
    } catch (error) {
      setApiBaseUrlOverride(previousApiBaseUrl);
      setAccessToken(previousAccessToken);
      showPageMessage(error.message, "error");
    }
  });

  document.querySelector("#connection-reset").addEventListener("click", () => {
    clearApiBaseUrlOverride();
    setAccessToken("");
    form.elements.apiBaseUrl.value = getApiBaseUrl();
    form.elements.accessToken.value = "";
    showPageMessage("Configuração local restaurada.", "success");
  });
}

export function showPageMessage(message, type = "info") {
  const container = document.querySelector("#page-message");
  if (!container) return;
  container.className = `page-message page-message--${type}`;
  container.textContent = message;
  container.hidden = false;
}

export function clearPageMessage() {
  const container = document.querySelector("#page-message");
  if (!container) return;
  container.hidden = true;
  container.textContent = "";
}

export function showGlobalError(error) {
  const main = document.querySelector("main");
  if (!main) return;
  const alert = document.createElement("div");
  alert.className = "global-alert";
  alert.setAttribute("role", "alert");
  alert.textContent =
    error instanceof Error ? error.message : "Ocorreu um erro inesperado.";
  main.prepend(alert);
}

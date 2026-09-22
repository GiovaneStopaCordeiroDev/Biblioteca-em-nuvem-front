import { getDashboardData } from "./services/dashboard.service.js";
import { renderDashboard } from "./ui/dashboard.render.js";
import { initializeLayout } from "./ui/layout.js";
import { showGlobalError } from "./core/feedback.js";
import { initializeBooksPage } from "./pages/livros.page.js";
import { initializeLoansPage } from "./pages/emprestimos.page.js";
import { initializeSettingsPage } from "./pages/configuracoes.page.js";
import { getCurrentUser } from "./services/usuarios.service.js";
import { renderCurrentUser } from "./ui/layout.render.js";
import { getAccessToken } from "./core/config.js";
import { logout } from "./services/autenticacao.service.js";

const LOGIN_PAGE = "index.html";

function redirectToLogin() {
  const currentPage = window.location.pathname.split("/").pop() || "dashboard.html";
  const returnTo = `${currentPage}${window.location.hash}`;
  window.location.replace(
    `${LOGIN_PAGE}?returnTo=${encodeURIComponent(returnTo)}`,
  );
}

async function initializeDashboard() {
  try {
    const dashboardData = await getDashboardData();
    renderDashboard(dashboardData);
  } catch (error) {
    console.error("Não foi possível carregar os dados do painel.", error);
    showGlobalError(error);
  }
}

const pageInitializers = {
  home: initializeDashboard,
  books: initializeBooksPage,
  loans: initializeLoansPage,
  settings: initializeSettingsPage,
};

async function initializeAuthenticatedApplication() {
  if (!getAccessToken()) {
    redirectToLogin();
    return;
  }

  initializeLayout();
  document.querySelector("#logout-button")?.addEventListener("click", async () => {
    const button = document.querySelector("#logout-button");
    button.disabled = true;
    try {
      await logout();
    } finally {
      window.location.replace(LOGIN_PAGE);
    }
  });

  const currentUser = await getCurrentUser();
  renderCurrentUser(currentUser);
  const initializePage = pageInitializers[document.body.dataset.page];
  await initializePage?.();
}

window.addEventListener("biblioteca:session-expired", redirectToLogin, {
  once: true,
});

initializeAuthenticatedApplication().catch((error) => {
  if (error?.status === 401) {
    redirectToLogin();
    return;
  }
  console.error("Não foi possível inicializar a página.", error);
  showGlobalError(error);
});

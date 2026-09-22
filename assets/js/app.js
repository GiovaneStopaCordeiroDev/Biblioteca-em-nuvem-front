import { getDashboardData } from "./services/dashboard.service.js";
import { renderDashboard } from "./ui/dashboard.render.js";
import { initializeLayout } from "./ui/layout.js";
import { showGlobalError } from "./core/feedback.js";
import { initializeBooksPage } from "./pages/livros.page.js";
import { initializeLoansPage } from "./pages/emprestimos.page.js";
import { initializeSettingsPage } from "./pages/configuracoes.page.js";
import { getCurrentUser } from "./services/usuarios.service.js";
import { renderCurrentUser } from "./ui/layout.render.js";

async function initializeDashboard() {
  try {
    const dashboardData = await getDashboardData();
    renderDashboard(dashboardData);
  } catch (error) {
    console.error("Não foi possível carregar os dados do painel.", error);
    showGlobalError(error);
  }
}

initializeLayout();

const pageInitializers = {
  home: initializeDashboard,
  books: initializeBooksPage,
  loans: initializeLoansPage,
  settings: initializeSettingsPage,
};

const initializePage = pageInitializers[document.body.dataset.page];
Promise.resolve()
  .then(async () => {
    try {
      renderCurrentUser(await getCurrentUser());
    } catch (error) {
      console.warn("Não foi possível identificar o operador atual.", error);
    }
  })
  .then(() => initializePage?.())
  .catch((error) => {
    console.error("Não foi possível inicializar a página.", error);
    showGlobalError(error);
  });

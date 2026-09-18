import { getDashboardData } from "./services/dashboard.service.js";
import { renderDashboard } from "./ui/dashboard.render.js";
import { initializeLayout } from "./ui/layout.js";

async function initializeDashboard() {
  try {
    const dashboardData = await getDashboardData();
    renderDashboard(dashboardData);
  } catch (error) {
    console.error("Não foi possível carregar os dados do painel.", error);
  }
}

initializeLayout();

if (document.querySelector("#summary-cards")) {
  initializeDashboard();
}


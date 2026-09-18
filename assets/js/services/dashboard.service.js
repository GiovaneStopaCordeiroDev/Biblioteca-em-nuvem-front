import { dashboardMock } from "../data/dashboard.mock.js";

export async function getDashboardData() {
  // TODO(back-end): substituir o mock por uma chamada HTTP para o endpoint do dashboard.
  // A interface deve continuar recebendo o mesmo formato de objeto para evitar acoplamento.
  return dashboardMock;
}


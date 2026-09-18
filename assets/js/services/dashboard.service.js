import { dashboardMockResponse } from "../data/dashboard.mock.js";

const STATUS_VIEW = Object.freeze({
  disponivel: { status: "available", statusLabel: "Disponível" },
  emprestado: { status: "borrowed", statusLabel: "Emprestado" },
});

function mapDashboardResponse(response) {
  return {
    summaries: [
      {
        id: "total-books",
        title: "Total de livros",
        value: response.totalLivros,
        description: "Livros cadastrados",
        icon: "book",
      },
      {
        id: "available-books",
        title: "Disponíveis",
        value: response.livrosDisponiveis,
        description: "Livros disponíveis",
        icon: "check-square",
      },
      {
        id: "borrowed-books",
        title: "Emprestados",
        value: response.emprestimosAtivos,
        description: "Empréstimos ativos",
        icon: "refresh",
      },
      {
        id: "overdue-loans",
        title: "Em atraso",
        value: response.emprestimosAtrasados,
        description: "Devoluções pendentes",
        icon: "overdue",
      },
    ],
    recentBooks: response.livrosRecentes.map((book) => ({
      id: book.id,
      title: book.titulo,
      author: book.autor,
      ...(STATUS_VIEW[book.status] ?? {
        status: "borrowed",
        statusLabel: book.status,
      }),
    })),
    quickActions: [
      { id: "manage-books", label: "Gerenciar livros", icon: "book" },
      { id: "view-loans", label: "Consultar empréstimos", icon: "history" },
      { id: "new-loan", label: "Novo empréstimo", icon: "refresh" },
    ],
  };
}

export async function getDashboardData() {
  /*
   * TODO(integração front-back): substituir somente a linha do mock abaixo por:
   *
   * const response = await fetch("URL_DA_API/api/dashboard");
   * if (!response.ok) throw new Error("Erro ao carregar o dashboard.");
   * const dashboardResponse = await response.json();
   *
   * O JSON deve seguir o contrato demonstrado em data/dashboard.mock.js.
   */
  const dashboardResponse = dashboardMockResponse;

  return mapDashboardResponse(dashboardResponse);
}


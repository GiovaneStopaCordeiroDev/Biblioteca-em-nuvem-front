import { apiRequest } from "../core/api-client.js";

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
        value: response.exemplaresDisponiveis,
        description: `${response.totalExemplares} exemplares no acervo`,
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
      {
        id: "manage-books",
        label: "Gerenciar livros",
        icon: "book",
        href: "livros.html",
      },
      {
        id: "view-loans",
        label: "Consultar empréstimos",
        icon: "history",
        href: "emprestimos.html",
      },
      {
        id: "new-loan",
        label: "Novo empréstimo",
        icon: "refresh",
        href: "emprestimos.html#novo",
      },
    ],
  };
}

export async function getDashboardData() {
  const [dashboardResponse, booksPage] = await Promise.all([
    apiRequest("/dashboard"),
    apiRequest("/livros?page=1&pageSize=5"),
  ]);

  return mapDashboardResponse({
    ...dashboardResponse,
    livrosRecentes: booksPage.items.map((book) => ({
      id: book.id,
      titulo: book.titulo,
      autor: book.autor,
      status: book.quantidadeDisponivel > 0 ? "disponivel" : "emprestado",
    })),
  });
}

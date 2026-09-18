// Simula exatamente o contrato esperado do futuro endpoint GET /api/dashboard.
export const dashboardMockResponse = Object.freeze({
  totalLivros: 245,
  livrosDisponiveis: 187,
  emprestimosAtivos: 58,
  emprestimosAtrasados: 4,
  livrosRecentes: [
    {
      id: "the-little-prince",
      titulo: "O Pequeno Príncipe",
      autor: "Antoine de Saint-Exupéry",
      status: "disponivel",
    },
    {
      id: "dom-casmurro",
      titulo: "Dom Casmurro",
      autor: "Machado de Assis",
      status: "emprestado",
    },
    {
      id: "harry-potter-philosophers-stone",
      titulo: "Harry Potter e a Pedra Filosofal",
      autor: "J. K. Rowling",
      status: "disponivel",
    },
  ],
});


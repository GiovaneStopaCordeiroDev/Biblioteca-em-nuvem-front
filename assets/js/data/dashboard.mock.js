export const dashboardMock = Object.freeze({
  summaries: [
    {
      id: "total-books",
      title: "Total de livros",
      value: 245,
      description: "Livros cadastrados",
      icon: "book",
    },
    {
      id: "available-books",
      title: "Disponíveis",
      value: 187,
      description: "Livros disponíveis",
      icon: "check-square",
    },
    {
      id: "borrowed-books",
      title: "Emprestados",
      value: 58,
      description: "Empréstimos ativos",
      icon: "refresh",
    },
    {
      id: "students",
      title: "Alunos",
      value: 320,
      description: "Alunos cadastrados",
      icon: "students",
    },
  ],
  recentBooks: [
    {
      id: "the-little-prince",
      title: "O Pequeno Príncipe",
      author: "Antoine de Saint-Exupéry",
      status: "available",
      statusLabel: "Disponível",
    },
    {
      id: "dom-casmurro",
      title: "Dom Casmurro",
      author: "Machado de Assis",
      status: "borrowed",
      statusLabel: "Emprestado",
    },
    {
      id: "harry-potter-philosophers-stone",
      title: "Harry Potter e a Pedra Filosofal",
      author: "J. K. Rowling",
      status: "available",
      statusLabel: "Disponível",
    },
  ],
  quickActions: [
    { id: "manage-books", label: "Gerenciar livros", icon: "book" },
    { id: "manage-students", label: "Gerenciar alunos", icon: "students" },
    { id: "new-loan", label: "Novo empréstimo", icon: "refresh" },
  ],
});


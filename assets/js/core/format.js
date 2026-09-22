export function formatDate(value) {
  if (!value) return "—";
  const [year, month, day] = value.split("-").map(Number);
  return new Intl.DateTimeFormat("pt-BR").format(
    new Date(year, month - 1, day),
  );
}

export function statusView(loan) {
  if (loan.status === "Cancelado") return { label: "Cancelado", tone: "muted" };
  if (loan.status === "Devolvido")
    return { label: "Devolvido", tone: "success" };
  if (loan.atrasado) return { label: "Em atraso", tone: "danger" };
  return { label: "Ativo", tone: "warning" };
}

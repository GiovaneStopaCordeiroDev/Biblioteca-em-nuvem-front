import { clearPageMessage, showPageMessage } from "../core/feedback.js";
import { formatDate, statusView } from "../core/format.js";
import {
  cancelLoan,
  createLoan,
  listLoans,
  renewLoan,
  returnLoan,
} from "../services/emprestimos.service.js";
import { listBooks } from "../services/livros.service.js";

const state = {
  page: 1,
  pageSize: 10,
  search: "",
  status: "",
  totalPages: 1,
  items: [],
};

function textCell(value) {
  const cell = document.createElement("td");
  cell.textContent = value ?? "—";
  return cell;
}

function actionButton(label, action, id, variant = "secondary") {
  const button = document.createElement("button");
  button.type = "button";
  button.className = `button button--${variant} button--small`;
  button.dataset.action = action;
  button.dataset.id = id;
  button.textContent = label;
  return button;
}

function renderLoans(page) {
  const body = document.querySelector("#loans-table-body");
  body.replaceChildren();

  if (!page.items.length) {
    const row = document.createElement("tr");
    const cell = document.createElement("td");
    cell.colSpan = 6;
    cell.className = "table-empty";
    cell.textContent = "Nenhum empréstimo encontrado.";
    row.append(cell);
    body.append(row);
  }

  for (const loan of page.items) {
    const row = document.createElement("tr");
    const status = statusView(loan);
    const statusBadge = document.createElement("span");
    statusBadge.className = `status-badge status-badge--${status.tone}`;
    statusBadge.textContent = status.label;
    const statusCell = document.createElement("td");
    statusCell.append(statusBadge);
    const actions = document.createElement("td");
    const group = document.createElement("div");
    group.className = "table-actions";
    if (loan.status === "Ativo") {
      group.append(actionButton("Devolver", "return", loan.id, "primary"));
      if (!loan.atrasado && loan.quantidadeRenovacoes < 2) {
        group.append(actionButton("Renovar", "renew", loan.id));
      }
    }
    if (loan.status !== "Cancelado") {
      group.append(actionButton("Cancelar", "cancel", loan.id, "danger"));
    }
    actions.append(group);
    row.append(
      textCell(loan.alunoNome),
      textCell(loan.livroTitulo),
      textCell(formatDate(loan.dataEmprestimo)),
      textCell(formatDate(loan.dataPrevistaDevolucao)),
      statusCell,
      actions,
    );
    body.append(row);
  }

  document.querySelector("#loans-page-label").textContent =
    `Página ${page.page} de ${Math.max(page.totalPages, 1)} · ${page.totalCount} empréstimo(s)`;
  document.querySelector("#loans-previous").disabled = page.page <= 1;
  document.querySelector("#loans-next").disabled = page.page >= page.totalPages;
}

async function loadLoans() {
  clearPageMessage();
  document.querySelector("#loans-loading").hidden = false;
  try {
    const page = await listLoans(state);
    state.page = page.page;
    state.totalPages = page.totalPages;
    state.items = page.items;
    renderLoans(page);
  } catch (error) {
    showPageMessage(error.message, "error");
  } finally {
    document.querySelector("#loans-loading").hidden = true;
  }
}

function replaceOptions(select, items, valueKey, labelFactory) {
  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.textContent = "Selecione";
  select.replaceChildren(placeholder);
  for (const item of items) {
    const option = document.createElement("option");
    option.value = item[valueKey];
    option.textContent = labelFactory(item);
    select.append(option);
  }
}

async function openCreateDialog() {
  const button = document.querySelector("#loan-create");
  button.disabled = true;
  try {
    const books = await listBooks({ pageSize: 100 });
    const availableBooks = books.items.filter(
      (book) => book.quantidadeDisponivel > 0,
    );
    replaceOptions(
      document.querySelector("#loan-book"),
      availableBooks,
      "id",
      (book) => `${book.titulo} · ${book.quantidadeDisponivel} disponível(is)`,
    );
    const form = document.querySelector("#loan-form");
    form.reset();
    document.querySelector("#loan-form-message").hidden = true;
    document.querySelector("#loan-dialog").showModal();
    document.querySelector("#loan-student-name").focus();
  } catch (error) {
    showPageMessage(error.message, "error");
  } finally {
    button.disabled = false;
  }
}

async function submitLoan(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const submit = form.querySelector('[type="submit"]');
  const payload = {
    alunoNome: form.elements.alunoNome.value,
    livroId: form.elements.livroId.value,
    dataPrevistaDevolucao: form.elements.dataPrevistaDevolucao.value || null,
    observacao: form.elements.observacao.value || null,
  };
  submit.disabled = true;
  try {
    await createLoan(payload);
    document.querySelector("#loan-dialog").close();
    state.page = 1;
    await loadLoans();
    showPageMessage("Empréstimo registrado com sucesso.", "success");
  } catch (error) {
    const message = document.querySelector("#loan-form-message");
    message.textContent = error.message;
    message.hidden = false;
  } finally {
    submit.disabled = false;
  }
}

async function handleLoanAction(event) {
  const button = event.target.closest("button[data-action]");
  if (!button) return;
  const loan = state.items.find((item) => item.id === button.dataset.id);
  if (!loan) return;
  const actions = {
    return: {
      confirmation: `Registrar a devolução de “${loan.livroTitulo}”?`,
      operation: returnLoan,
    },
    renew: {
      confirmation: `Renovar “${loan.livroTitulo}” por mais 14 dias?`,
      operation: renewLoan,
    },
    cancel: {
      confirmation: `Cancelar este empréstimo de “${loan.livroTitulo}”?`,
      operation: cancelLoan,
    },
  };
  const selected = actions[button.dataset.action];
  if (!selected || !window.confirm(selected.confirmation)) return;
  button.disabled = true;
  try {
    await selected.operation(loan.id);
    await loadLoans();
    showPageMessage("Operação realizada com sucesso.", "success");
  } catch (error) {
    showPageMessage(error.message, "error");
    button.disabled = false;
  }
}

export async function initializeLoansPage() {
  document.querySelector('[name="dataPrevistaDevolucao"]').min = new Date()
    .toISOString()
    .slice(0, 10);
  document
    .querySelector("#loan-create")
    .addEventListener("click", openCreateDialog);
  document
    .querySelector("#loan-dialog-cancel")
    .addEventListener("click", () =>
      document.querySelector("#loan-dialog").close(),
    );
  document.querySelector("#loan-form").addEventListener("submit", submitLoan);
  document
    .querySelector("#loans-table-body")
    .addEventListener("click", handleLoanAction);
  document
    .querySelector("#loans-filter-form")
    .addEventListener("submit", async (event) => {
      event.preventDefault();
      state.search = event.currentTarget.elements.search.value;
      state.status = event.currentTarget.elements.status.value;
      state.page = 1;
      await loadLoans();
    });
  document
    .querySelector("#loans-previous")
    .addEventListener("click", async () => {
      state.page -= 1;
      await loadLoans();
    });
  document.querySelector("#loans-next").addEventListener("click", async () => {
    state.page += 1;
    await loadLoans();
  });
  await loadLoans();
  if (window.location.hash === "#novo") await openCreateDialog();
}

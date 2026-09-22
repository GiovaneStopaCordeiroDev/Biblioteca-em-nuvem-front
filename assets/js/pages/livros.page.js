import { clearPageMessage, showPageMessage } from "../core/feedback.js";
import {
  createBook,
  deleteBook,
  listBooks,
  updateBook,
} from "../services/livros.service.js";

const state = { page: 1, pageSize: 10, search: "", totalPages: 1, items: [] };

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

function renderBooks(page) {
  const body = document.querySelector("#books-table-body");
  body.replaceChildren();

  if (!page.items.length) {
    const row = document.createElement("tr");
    const cell = document.createElement("td");
    cell.colSpan = 6;
    cell.className = "table-empty";
    cell.textContent = "Nenhum livro encontrado.";
    row.append(cell);
    body.append(row);
  }

  for (const book of page.items) {
    const row = document.createElement("tr");
    const stock = document.createElement("span");
    stock.className = `status-badge status-badge--${book.quantidadeDisponivel > 0 ? "success" : "danger"}`;
    stock.textContent = `${book.quantidadeDisponivel}/${book.quantidadeTotal}`;
    const stockCell = document.createElement("td");
    stockCell.append(stock);
    const actions = document.createElement("td");
    const group = document.createElement("div");
    group.className = "table-actions";
    group.append(actionButton("Editar", "edit", book.id));
    group.append(actionButton("Excluir", "delete", book.id, "danger"));
    actions.append(group);
    row.append(
      textCell(book.titulo),
      textCell(book.autor),
      textCell(book.isbn),
      textCell(book.categoria),
      stockCell,
      actions,
    );
    body.append(row);
  }

  document.querySelector("#books-page-label").textContent =
    `Página ${page.page} de ${Math.max(page.totalPages, 1)} · ${page.totalCount} livro(s)`;
  document.querySelector("#books-previous").disabled = page.page <= 1;
  document.querySelector("#books-next").disabled = page.page >= page.totalPages;
}

async function loadBooks() {
  clearPageMessage();
  document.querySelector("#books-loading").hidden = false;
  try {
    const page = await listBooks(state);
    state.page = page.page;
    state.totalPages = page.totalPages;
    state.items = page.items;
    renderBooks(page);
  } catch (error) {
    showPageMessage(error.message, "error");
  } finally {
    document.querySelector("#books-loading").hidden = true;
  }
}

function openCreateDialog() {
  const form = document.querySelector("#book-form");
  form.reset();
  form.elements.id.value = "";
  form.elements.versao.value = "";
  form.elements.quantidadeTotal.value = "1";
  document.querySelector("#book-form-message").hidden = true;
  document.querySelector("#book-dialog-title").textContent = "Cadastrar livro";
  document.querySelector("#book-dialog").showModal();
  form.elements.titulo.focus();
}

function openEditDialog(book) {
  const form = document.querySelector("#book-form");
  form.elements.id.value = book.id;
  form.elements.versao.value = book.versao;
  form.elements.titulo.value = book.titulo;
  form.elements.autor.value = book.autor;
  form.elements.isbn.value = book.isbn ?? "";
  form.elements.categoria.value = book.categoria ?? "";
  form.elements.quantidadeTotal.value = String(book.quantidadeTotal);
  document.querySelector("#book-form-message").hidden = true;
  document.querySelector("#book-dialog-title").textContent = "Editar livro";
  document.querySelector("#book-dialog").showModal();
  form.elements.titulo.focus();
}

async function submitBook(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const submit = form.querySelector('[type="submit"]');
  const id = form.elements.id.value;
  const payload = {
    titulo: form.elements.titulo.value,
    autor: form.elements.autor.value,
    isbn: form.elements.isbn.value || null,
    categoria: form.elements.categoria.value || null,
    quantidadeTotal: Number(form.elements.quantidadeTotal.value),
  };
  if (id) payload.versao = form.elements.versao.value;

  submit.disabled = true;
  try {
    if (id) {
      await updateBook(id, payload);
    } else {
      await createBook(payload);
      state.page = 1;
    }
    document.querySelector("#book-dialog").close();
    await loadBooks();
    showPageMessage(
      id ? "Livro atualizado com sucesso." : "Livro cadastrado com sucesso.",
      "success",
    );
  } catch (error) {
    const message = document.querySelector("#book-form-message");
    message.textContent = error.message;
    message.hidden = false;
  } finally {
    submit.disabled = false;
  }
}

async function handleTableAction(event) {
  const button = event.target.closest("button[data-action]");
  if (!button) return;
  const book = state.items.find((item) => item.id === button.dataset.id);
  if (!book) return;
  if (button.dataset.action === "edit") {
    openEditDialog(book);
    return;
  }
  if (!window.confirm(`Excluir “${book.titulo}”?`)) return;
  button.disabled = true;
  try {
    await deleteBook(book.id);
    await loadBooks();
    showPageMessage("Livro excluído com sucesso.", "success");
  } catch (error) {
    showPageMessage(error.message, "error");
    button.disabled = false;
  }
}

export async function initializeBooksPage() {
  document
    .querySelector("#book-create")
    .addEventListener("click", openCreateDialog);
  document
    .querySelector("#book-dialog-cancel")
    .addEventListener("click", () =>
      document.querySelector("#book-dialog").close(),
    );
  document.querySelector("#book-form").addEventListener("submit", submitBook);
  document
    .querySelector("#books-table-body")
    .addEventListener("click", handleTableAction);
  document
    .querySelector("#books-search-form")
    .addEventListener("submit", async (event) => {
      event.preventDefault();
      state.search = event.currentTarget.elements.search.value;
      state.page = 1;
      await loadBooks();
    });
  document
    .querySelector("#books-previous")
    .addEventListener("click", async () => {
      state.page -= 1;
      await loadBooks();
    });
  document.querySelector("#books-next").addEventListener("click", async () => {
    state.page += 1;
    await loadBooks();
  });
  await loadBooks();
}

import { createIcon } from "./icon.js";

function createSummaryCard(summary) {
  const article = document.createElement("article");
  const header = document.createElement("div");
  const title = document.createElement("h2");
  const value = document.createElement("p");
  const description = document.createElement("p");

  article.className = "summary-card";
  article.setAttribute("aria-labelledby", `${summary.id}-title`);
  header.className = "summary-card__header";
  title.id = `${summary.id}-title`;
  title.className = "summary-card__title";
  title.textContent = summary.title;
  value.className = "summary-card__value";
  value.textContent = summary.value.toLocaleString("pt-BR");
  description.className = "summary-card__description";
  description.textContent = summary.description;

  header.append(title, createIcon(summary.icon, "summary-card__icon"));
  article.append(header, value, description);

  return article;
}

function createBookItem(book) {
  const item = document.createElement("li");
  const iconBox = document.createElement("span");
  const details = document.createElement("div");
  const title = document.createElement("p");
  const author = document.createElement("p");
  const status = document.createElement("span");

  item.className = "book-item";
  iconBox.className = "book-item__icon-box";
  details.className = "book-item__details";
  title.className = "book-item__title";
  title.textContent = book.title;
  author.className = "book-item__author";
  author.textContent = book.author;
  status.className = `book-item__status book-item__status--${book.status}`;
  status.textContent = book.statusLabel;

  iconBox.append(createIcon("book", "book-item__icon"));
  details.append(title, author);
  item.append(iconBox, details, status);

  return item;
}

function createQuickAction(action) {
  const link = document.createElement("a");
  const label = document.createElement("span");

  link.className = "quick-action";
  link.href = action.href;
  link.dataset.action = action.id;
  label.textContent = action.label;

  link.append(createIcon(action.icon, "quick-action__icon"), label);
  return link;
}

export function renderDashboard({ summaries, recentBooks, quickActions }) {
  const summaryContainer = document.querySelector("#summary-cards");
  const recentBooksContainer = document.querySelector("#recent-books-list");
  const quickActionsContainer = document.querySelector("#quick-actions");

  if (!summaryContainer || !recentBooksContainer || !quickActionsContainer) {
    throw new Error("A estrutura HTML do dashboard está incompleta.");
  }

  summaryContainer.replaceChildren(...summaries.map(createSummaryCard));
  recentBooksContainer.replaceChildren(...recentBooks.map(createBookItem));
  quickActionsContainer.replaceChildren(...quickActions.map(createQuickAction));
}


import { getAccessToken } from "../core/config.js";
import { login } from "../services/autenticacao.service.js";

const RETURN_PAGES = new Map([
  ["dashboard", "dashboard.html"],
  ["dashboard.html", "dashboard.html"],
  ["livros", "livros.html"],
  ["livros.html", "livros.html"],
  ["emprestimos", "emprestimos.html"],
  ["emprestimos.html", "emprestimos.html"],
  ["configuracoes", "configuracoes.html"],
  ["configuracoes.html", "configuracoes.html"],
  ["ajuda", "ajuda.html"],
  ["ajuda.html", "ajuda.html"],
]);

const dialog = document.querySelector("#login-dialog");
const form = document.querySelector("#login-form");
const message = document.querySelector("#login-message");
const openButtons = [
  document.querySelector("#login-open"),
  document.querySelector("#login-hero"),
];

function safeReturnUrl() {
  const requested = new URLSearchParams(window.location.search).get("returnTo") ?? "";
  const [page, hash = ""] = requested.split("#", 2);
  const destination = RETURN_PAGES.get(page);
  return destination
    ? `${destination}${hash ? `#${hash}` : ""}`
    : "dashboard.html";
}

function openLogin() {
  message.hidden = true;
  dialog.showModal();
  form.elements.usuario.focus();
}

if (getAccessToken()) {
  for (const button of openButtons) {
    button.textContent = "Abrir sistema";
    button.addEventListener("click", () => window.location.assign(safeReturnUrl()));
  }
} else {
  for (const button of openButtons) button.addEventListener("click", openLogin);
}

document.querySelector("#login-close").addEventListener("click", () => dialog.close());
dialog.addEventListener("click", (event) => {
  if (event.target === dialog) dialog.close();
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const submit = form.querySelector('[type="submit"]');
  submit.disabled = true;
  submit.textContent = "Entrando…";
  message.hidden = true;
  try {
    await login(form.elements.usuario.value, form.elements.senha.value);
    window.location.replace(safeReturnUrl());
  } catch (error) {
    message.textContent =
      error?.status === 401
        ? "Usuário ou senha inválidos."
        : error.message;
    message.hidden = false;
    form.elements.senha.value = "";
    form.elements.senha.focus();
  } finally {
    submit.disabled = false;
    submit.textContent = "Entrar";
  }
});

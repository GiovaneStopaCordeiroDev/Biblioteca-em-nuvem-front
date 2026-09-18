const NAVIGATION_GROUPS = Object.freeze([
  {
    label: "Menu principal",
    items: [
      { id: "home", label: "Início", href: "index.html", icon: "home" },
      { id: "books", label: "Livros", href: "livros.html", icon: "book" },
      { id: "loans", label: "Empréstimos", href: "emprestimos.html", icon: "refresh" },
    ],
  },
  {
    label: "Sistema",
    items: [
      {
        id: "settings",
        label: "Configurações",
        href: "configuracoes.html",
        icon: "settings",
      },
      { id: "help", label: "Ajuda", href: "ajuda.html", icon: "help" },
    ],
  },
]);

function iconMarkup(icon, className) {
  return `
    <svg class="${className}" aria-hidden="true" focusable="false">
      <use href="assets/icons/icons.svg#${icon}"></use>
    </svg>
  `;
}

function navigationMarkup(activePage) {
  return NAVIGATION_GROUPS.map(
    (group) => `
      <section class="sidebar__group" aria-labelledby="nav-${group.label.replaceAll(" ", "-")}">
        <h2 id="nav-${group.label.replaceAll(" ", "-")}" class="sidebar__group-title">
          ${group.label}
        </h2>
        <ul class="sidebar__list">
          ${group.items
            .map(
              (item) => `
                <li>
                  <a
                    class="sidebar__link"
                    href="${item.href}"
                    ${item.id === activePage ? 'aria-current="page"' : ""}
                  >
                    ${iconMarkup(item.icon, "sidebar__link-icon")}
                    <span>${item.label}</span>
                  </a>
                </li>
              `,
            )
            .join("")}
        </ul>
      </section>
    `,
  ).join("");
}

export function renderLayout(activePage) {
  const header = document.querySelector("#site-header");
  const sidebar = document.querySelector("#site-sidebar");
  const footer = document.querySelector("#site-footer");

  if (!header || !sidebar || !footer) {
    throw new Error("A estrutura base do layout está incompleta.");
  }

  header.className = "topbar";
  header.innerHTML = `
    <div class="topbar__left">
      <button
        id="sidebar-toggle"
        class="topbar__menu-button"
        type="button"
        aria-label="Abrir menu lateral"
        aria-controls="site-sidebar"
        aria-expanded="false"
      >
        ${iconMarkup("menu", "topbar__icon")}
      </button>
      <p class="topbar__title">Biblioteca Escolar</p>
    </div>

    <div class="topbar__right">
      <button class="topbar__notification" type="button" aria-label="Notificações">
        ${iconMarkup("bell", "topbar__icon")}
      </button>
      <div class="topbar__profile" aria-label="Usuário atual: Administrador da biblioteca">
        <span class="topbar__avatar" aria-hidden="true">A</span>
        <div class="topbar__profile-copy">
          <span class="topbar__profile-name">Administrador</span>
          <span class="topbar__profile-role">Biblioteca</span>
        </div>
      </div>
    </div>
  `;

  sidebar.className = "sidebar";
  sidebar.setAttribute("aria-label", "Navegação principal");
  sidebar.innerHTML = `
    <div class="sidebar__brand">
      <span class="sidebar__logo">
        ${iconMarkup("library", "sidebar__logo-icon")}
      </span>
      <p class="sidebar__brand-name">Biblioteca</p>
      <button id="sidebar-close" class="sidebar__close" type="button" aria-label="Fechar menu">
        ${iconMarkup("close", "sidebar__close-icon")}
      </button>
    </div>
    <nav class="sidebar__navigation">
      ${navigationMarkup(activePage)}
    </nav>
  `;

  footer.className = "footer";
  footer.innerHTML = `
    <p class="footer__text">
      © <span id="current-year">${new Date().getFullYear()}</span> Biblioteca Escolar
      <span aria-hidden="true"> | </span>Sistema da Sala de Leitura
    </p>
  `;
}


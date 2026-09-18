import { renderLayout } from "./layout.render.js";

const DESKTOP_MEDIA_QUERY = "(min-width: 64rem)";

export function initializeLayout() {
  const activePage = document.body.dataset.page ?? "home";
  renderLayout(activePage);

  const body = document.body;
  const sidebar = document.querySelector("#site-sidebar");
  const toggleButton = document.querySelector("#sidebar-toggle");
  const closeButton = document.querySelector("#sidebar-close");
  const overlay = document.querySelector("#sidebar-overlay");
  const navigationLinks = sidebar?.querySelectorAll(".sidebar__link") ?? [];
  const desktopMedia = window.matchMedia(DESKTOP_MEDIA_QUERY);

  if (!sidebar || !toggleButton || !closeButton || !overlay) {
    throw new Error("Não foi possível inicializar o menu lateral.");
  }

  function syncSidebarAccessibility() {
    const isDesktop = desktopMedia.matches;
    const isOpen = body.classList.contains("sidebar-open");
    const isCollapsed = body.classList.contains("sidebar-collapsed");
    const isVisible = isDesktop ? !isCollapsed : isOpen;

    sidebar.inert = !isVisible;
    sidebar.toggleAttribute("aria-hidden", !isVisible);
    toggleButton.setAttribute("aria-expanded", String(isVisible));
    toggleButton.setAttribute("aria-label", isVisible ? "Fechar menu lateral" : "Abrir menu lateral");
  }

  function openSidebar() {
    if (desktopMedia.matches) return;

    body.classList.add("sidebar-open");
    syncSidebarAccessibility();
    closeButton.focus();
  }

  function closeSidebar({ restoreFocus = true } = {}) {
    body.classList.remove("sidebar-open");
    syncSidebarAccessibility();

    if (restoreFocus && !desktopMedia.matches) {
      toggleButton.focus();
    }
  }

  toggleButton.addEventListener("click", () => {
    if (desktopMedia.matches) {
      body.classList.toggle("sidebar-collapsed");
      syncSidebarAccessibility();
      return;
    }

    if (body.classList.contains("sidebar-open")) {
      closeSidebar();
    } else {
      openSidebar();
    }
  });

  closeButton.addEventListener("click", () => closeSidebar());
  overlay.addEventListener("click", () => closeSidebar());
  navigationLinks.forEach((link) => {
    link.addEventListener("click", () => closeSidebar({ restoreFocus: false }));
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && body.classList.contains("sidebar-open")) {
      closeSidebar();
    }
  });

  desktopMedia.addEventListener("change", () => {
    body.classList.remove("sidebar-open");
    body.classList.remove("sidebar-collapsed");
    syncSidebarAccessibility();
  });

  syncSidebarAccessibility();
}

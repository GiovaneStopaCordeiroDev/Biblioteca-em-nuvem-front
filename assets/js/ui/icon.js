const SVG_NAMESPACE = "http://www.w3.org/2000/svg";
const ICON_SPRITE_PATH = "assets/icons/icons.svg";

export function createIcon(iconName, className) {
  const icon = document.createElementNS(SVG_NAMESPACE, "svg");
  const use = document.createElementNS(SVG_NAMESPACE, "use");

  icon.classList.add(className);
  icon.setAttribute("aria-hidden", "true");
  icon.setAttribute("focusable", "false");
  use.setAttribute("href", `${ICON_SPRITE_PATH}#${iconName}`);
  icon.append(use);

  return icon;
}


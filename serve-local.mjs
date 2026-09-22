import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { createServer } from "node:http";
import { extname, join, normalize, resolve, sep } from "node:path";

const root = resolve(process.cwd());
const port = Number.parseInt(process.env.PORT ?? "5500", 10);
const routes = new Map([
  ["/", "index.html"],
  ["/dashboard", "dashboard.html"],
  ["/livros", "livros.html"],
  ["/emprestimos", "emprestimos.html"],
  ["/configuracoes", "configuracoes.html"],
  ["/ajuda", "ajuda.html"],
]);
const contentTypes = new Map([
  [".css", "text/css; charset=utf-8"],
  [".html", "text/html; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"],
  [".mjs", "text/javascript; charset=utf-8"],
  [".png", "image/png"],
  [".svg", "image/svg+xml"],
  [".woff2", "font/woff2"],
]);

function localPath(pathname) {
  const decoded = decodeURIComponent(pathname);
  const requested = routes.get(decoded) ?? decoded.replace(/^\/+/, "");
  const absolute = resolve(join(root, normalize(requested)));
  return absolute === root || absolute.startsWith(`${root}${sep}`)
    ? absolute
    : null;
}

const server = createServer(async (request, response) => {
  try {
    const url = new URL(request.url ?? "/", "http://localhost");
    const filePath = localPath(url.pathname);
    if (!filePath || !(await stat(filePath)).isFile()) {
      response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      response.end("Página não encontrada.");
      return;
    }

    response.writeHead(200, {
      "Cache-Control": "no-store",
      "Content-Type": contentTypes.get(extname(filePath).toLowerCase())
        ?? "application/octet-stream",
    });
    createReadStream(filePath).pipe(response);
  } catch {
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Página não encontrada.");
  }
});

server.listen(port, "127.0.0.1", () => {
  console.log(`Front-end disponível em http://localhost:${port}`);
});

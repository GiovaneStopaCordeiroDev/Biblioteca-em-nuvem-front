import { apiRequest } from "../core/api-client.js";

export function listBooks({ page = 1, pageSize = 10, search = "" } = {}) {
  const query = new URLSearchParams({ page, pageSize });
  if (search.trim()) query.set("busca", search.trim());
  return apiRequest(`/livros?${query}`);
}

export function createBook(book) {
  return apiRequest("/livros", { method: "POST", body: book });
}

export function updateBook(id, book) {
  return apiRequest(`/livros/${encodeURIComponent(id)}`, {
    method: "PUT",
    body: book,
  });
}

export function deleteBook(id) {
  return apiRequest(`/livros/${encodeURIComponent(id)}`, { method: "DELETE" });
}

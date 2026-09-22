import { apiRequest } from "../core/api-client.js";

export function listLoans({
  page = 1,
  pageSize = 10,
  search = "",
  status = "",
} = {}) {
  const query = new URLSearchParams({ page, pageSize });
  if (search.trim()) query.set("busca", search.trim());
  if (status) query.set("status", status);
  return apiRequest(`/emprestimos?${query}`);
}

export function createLoan(loan) {
  return apiRequest("/emprestimos", { method: "POST", body: loan });
}

export function returnLoan(id) {
  return apiRequest(`/emprestimos/${encodeURIComponent(id)}/devolucao`, {
    method: "PATCH",
  });
}

export function renewLoan(id) {
  return apiRequest(`/emprestimos/${encodeURIComponent(id)}/renovar`, {
    method: "PATCH",
  });
}

export function cancelLoan(id) {
  return apiRequest(`/emprestimos/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}

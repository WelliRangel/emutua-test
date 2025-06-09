import { apiFetch } from "./api";

export async function getProducts(page = 1) {
	return apiFetch(`/api/produtos?page=${page}`);
}

export async function getProductById(id: string) {
	return apiFetch(`/api/produtos/${id}`);
}

export async function createProduct(data: any) {
	return apiFetch("/api/produtos", {
		method: "POST",
		body: JSON.stringify(data),
	});
}

export async function updateProduct(id: string, data: any) {
	return apiFetch(`/api/produtos/${id}`, {
		method: "PUT",
		body: JSON.stringify(data),
	});
}

export async function deleteProduct(id: string) {
	return apiFetch(`/api/produtos/${id}`, {
		method: "DELETE",
	});
}

export async function searchProducts(query: string) {
	return apiFetch(`/api/produtos/search?q=${encodeURIComponent(query)}`);
}

export async function getProductsByCategory(category: string) {
	return apiFetch(`/api/produtos/categorias/${category}`);
}

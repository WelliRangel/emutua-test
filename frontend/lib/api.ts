const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function apiFetch(path: string, options: RequestInit = {}) {
	const res = await fetch(`${API_URL}${path}`, {
		headers: { "Content-Type": "application/json" },
		...options,
	});
	if (!res.ok) {
		const error = await res.json().catch(() => ({}));
		throw new Error(error.message || "Erro na requisição");
	}
	return res.json();
}

const API_URL = "";

export async function apiFetch(endpoint, options = {}) {
    const res = await fetch(API_URL + endpoint, {
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            ...options.headers
        },
        ...options
    });

    const data = await res.json().catch(() => null);

    // 🔥 IMPORTANTE: trata erro HTTP
    if (!res.ok) {
        throw {
            status: res.status,
            message: data?.message || "Erro na requisição",
            data
        };
    }

    return data;
}
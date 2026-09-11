/**
 * Pequena camada de acesso à API (PROMPT-APP.md #60). Evita espalhar
 * `fetch(...)` por dezenas de componentes — todo mundo passa por aqui.
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5080";

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

const DEFAULT_ERROR_MESSAGE = "Não foi possível completar a operação. Tente novamente.";

async function parseErrorMessage(response: Response): Promise<string> {
  try {
    const body = await response.json();
    if (body && typeof body.message === "string" && body.message.trim() !== "") {
      return body.message;
    }
  } catch {
    // resposta sem corpo JSON (ex.: erro de rede/proxy) — usa mensagem padrão
  }

  if (response.status === 401) return "Sua sessão expirou. Entre novamente.";
  if (response.status === 403) return "Você não tem permissão para fazer isso.";
  if (response.status === 404) return "Não encontramos o que você procurava.";
  if (response.status === 429) return "Muitas tentativas. Aguarde um instante e tente novamente.";

  return DEFAULT_ERROR_MESSAGE;
}

interface RequestOptions {
  method?: string;
  json?: unknown;
  signal?: AbortSignal;
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = "GET", json, signal } = options;

  const response = await fetch(`${API_URL}${path}`, {
    method,
    credentials: "include",
    signal,
    headers: json !== undefined ? { "Content-Type": "application/json" } : undefined,
    body: json !== undefined ? JSON.stringify(json) : undefined,
  });

  if (!response.ok) {
    throw new ApiError(await parseErrorMessage(response), response.status);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const contentType = response.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    return (await response.json()) as T;
  }

  return undefined as T;
}

async function requestBlob(path: string, signal?: AbortSignal): Promise<Blob> {
  const response = await fetch(`${API_URL}${path}`, { credentials: "include", signal });

  if (!response.ok) {
    throw new ApiError(await parseErrorMessage(response), response.status);
  }

  return response.blob();
}

async function requestForm<T>(path: string, formData: FormData): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  if (!response.ok) {
    throw new ApiError(await parseErrorMessage(response), response.status);
  }

  return (await response.json()) as T;
}

export const api = {
  get: <T>(path: string, signal?: AbortSignal) => request<T>(path, { method: "GET", signal }),
  post: <T>(path: string, json?: unknown, signal?: AbortSignal) =>
    request<T>(path, { method: "POST", json, signal }),
  put: <T>(path: string, json?: unknown, signal?: AbortSignal) =>
    request<T>(path, { method: "PUT", json, signal }),
  postForm: <T>(path: string, formData: FormData) => requestForm<T>(path, formData),
  getBlob: (path: string, signal?: AbortSignal) => requestBlob(path, signal),
};

export function apiUrl(path: string): string {
  return `${API_URL}${path}`;
}

export { API_URL };

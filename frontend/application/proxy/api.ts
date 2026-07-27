export type QueryParams = Record<
  string,
  string | number | boolean | undefined | null
>;

type FetchOptions = RequestInit & {
  query?: QueryParams;
};

function buildApiUrl(
  baseUrl: string | undefined,
  path: string,
  query?: QueryParams,
) {
  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_BACKEND_URL is not defined.");
  }

  const url = new URL(path, baseUrl);

  Object.entries(query ?? {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.set(key, String(value));
    }
  });

  return url.toString();
}

export async function fetchFromClient(url: string, options: FetchOptions = {}) {
  const { query, ...fetchOptions } = options;

  return fetch(buildApiUrl(process.env.NEXT_PUBLIC_BACKEND_URL, url, query), {
    ...fetchOptions,
    credentials: "include",
  });
}

export async function parseJsonResponse<T>(response: Response): Promise<T> {
  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      payload && typeof payload === "object" && "message" in payload
        ? String(payload.message)
        : `Erreur HTTP ${response.status}`;

    throw new Error(message);
  }

  return payload as T;
}

export async function fetchJsonFromClient<T>(
  url: string,
  options: FetchOptions = {},
) {
  const response = await fetchFromClient(url, options);
  return parseJsonResponse<T>(response);
}

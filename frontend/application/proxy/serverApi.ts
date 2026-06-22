"use server";

import { cookies } from "next/headers";
import type { QueryParams } from "./api";

type ServerFetchOptions = RequestInit & {
  query?: QueryParams;
};

function buildServerApiUrl(
  baseUrl: string | undefined,
  path: string,
  query?: QueryParams,
) {
  if (!baseUrl) {
    throw new Error("INTERNAL_BACKEND_URL is not defined.");
  }

  const url = new URL(path, baseUrl);

  Object.entries(query ?? {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.set(key, String(value));
    }
  });

  return url.toString();
}

export async function fetchFromServer(
  url: string,
  options: ServerFetchOptions = {},
) {
  const { query, ...fetchOptions } = options;

  const fetchHeaders = new Headers(fetchOptions.headers);

  const cookieStore = await cookies();
  const allCookiesString = cookieStore.toString();

  if (allCookiesString) {
    fetchHeaders.set("Cookie", allCookiesString);
  }

  return await fetch(
    buildServerApiUrl(process.env.INTERNAL_BACKEND_URL, url, query),
    {
      ...fetchOptions,
      headers: fetchHeaders,
    },
  );
}

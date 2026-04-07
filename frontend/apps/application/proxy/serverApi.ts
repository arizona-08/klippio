"use server"

import { cookies } from "next/headers";

export async function fetchFromServer(url: string, options: RequestInit = {}){
  const baseUrl = process.env.INTERNAL_BACKEND_URL;
  // console.log(baseUrl);

  const fetchHeaders = new Headers(options.headers);

  const cookieStore = await cookies();
  const allCookiesString = cookieStore.toString();

  if (allCookiesString) {
    fetchHeaders.set('Cookie', allCookiesString);
  }
  
  return await fetch(`${baseUrl}${url}`, {
    ...options,
    headers: fetchHeaders,
  })
}
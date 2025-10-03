export async function getApi(url: string, options: RequestInit = {}){
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  // console.log(baseUrl);
  return await fetch(`${baseUrl}${url}`, {
    ...options,
    credentials: "include"
  })
}
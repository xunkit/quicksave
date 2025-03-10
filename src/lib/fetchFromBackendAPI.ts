import { auth } from "@/auth";

export default async function fetchFromBackendAPI(
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Invalid Session");
  }

  const baseUrl = process.env.BACKEND_BASE_URL || "http://localhost:8080";
  const url = `${baseUrl}${endpoint}`;

  const res = await fetch(url, { cache: "no-store", ...options });

  if (!res.ok) {
    throw new Error(`Failed to fetch ${endpoint}: ${res.statusText}`);
  }

  return res;
}

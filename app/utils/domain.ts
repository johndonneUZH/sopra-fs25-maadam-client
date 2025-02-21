//import process from "node:process";
import { isProduction } from "@/utils/environment";
/**
 * Returns the API base URL based on the current environment.
 * In production it retrieves the URL from NEXT_PUBLIC_PROD_API_URL (or falls back to a hardcoded url).
 * In development, it returns "http://localhost:8080".
 */
const NEXT_PUBLIC_PROD_API_URL = 'https://sopra-fs25-maadam-server.oa.r.appspot.com/';
export function getApiDomain(): string {
  const prodUrl = NEXT_PUBLIC_PROD_API_URL ||
    "http://localhost:8080"; // TODO: update with your production URL as needed.
  const devUrl = "http://localhost:8080";
  return isProduction() ? prodUrl : devUrl;
}

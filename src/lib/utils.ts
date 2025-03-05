import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getParentSite(url: string): string | null {
  try {
    const hostname = new URL(url).hostname;
    return hostname;
  } catch (error) {
    console.error(error);
    return "";
  }
}

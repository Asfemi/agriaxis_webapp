import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function userToken(): string | null {
  return localStorage.getItem('auth_token')
}

export function saveOrgId(orgId: string) {
  localStorage.setItem('org_id', orgId)
}

export function getOrgId(): string | null {
  return localStorage.getItem('org_id')
}

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);

  if (isNaN(date.getTime())) {
    return "Invalid Date";
  }

  const day = new Intl.DateTimeFormat("en-GB", { day: "numeric" }).format(date);
  const month = new Intl.DateTimeFormat("en-GB", { month: "short" }).format(date);
  const year = new Intl.DateTimeFormat("en-GB", { year: "numeric" }).format(date);

  return `${day} ${month}, ${year}`;
};

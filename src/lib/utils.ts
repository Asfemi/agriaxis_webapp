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

export function getOrgId() {
  return localStorage.getItem('org_id')
}

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function userToken(): string | null {
  return localStorage.getItem("auth_token");
}

export function saveOrgId(orgId: string) {
  localStorage.setItem("org_id", orgId);
}

export function getOrgId(): string | null {
  return localStorage.getItem("org_id");
}

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);

  if (isNaN(date.getTime())) {
    return "Invalid Date";
  }

  const day = new Intl.DateTimeFormat("en-GB", { day: "numeric" }).format(date);
  const month = new Intl.DateTimeFormat("en-GB", { month: "short" }).format(
    date,
  );
  const year = new Intl.DateTimeFormat("en-GB", { year: "numeric" }).format(
    date,
  );

  return `${day} ${month}, ${year}`;
};

export const formatDateEpoch = (dateEpoch: number): string => {
  const timestamp = dateEpoch;
  const date = new Date(timestamp * 1000);

  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
};

/**
 * Formats a timestamp into a human-readable string using the 24-hour format.
 * @param epoch The timestamp to format.
 * @returns The formatted timestamp.
 */
export const formatTimeEpoch = (epoch: number): string => {
  const date = new Date(epoch * 1000);

  const time = new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);

  return time;
};

/**
 * Formats a timestamp into a human-readable string using the 12-hour format.
 * @param epoch The timestamp to format.
 * @returns The formatted timestamp.
 */
export const formatWeekdayEpoch = (epoch: number): string => {
  const date = new Date(epoch * 1000);
  const weekday = new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
  }).format(date);

  return weekday;
}

export interface TaskItem {
  _id: string;
  date: string;
  title: string;
  order: number;
  labels?: string[];
  startTime?: string;
  endTime?: string;
  createdBy?: {
    name: string;
    email: string;
    nickname?: string;
  };
  /** Country codes this event is tied to; empty = all countries. */
  countryCodes?: string[];
  /** If set, this event is linked to a series (range/recurrence). */
  seriesId?: string;
  recurrence?: {
    freq: 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly';
    byWeekDays?: number[];
  };
  createdAt?: string;
  updatedAt?: string;
}

/** PublicHolidayV3Dto — Nager.Date API v3 (configured via `VITE_NAGER_DATE_API_URL`) */
export interface PublicHoliday {
  date: string;
  localName: string;
  name: string;
  countryCode: string;
  fixed?: boolean;
  global?: boolean;
  counties?: string[] | null;
  launchYear?: number | null;
  types: string[];
}

export type HolidaysByDate = Record<string, PublicHoliday[]>;

/** CountryV3Dto — from GET /api/v3/AvailableCountries */
export interface AvailableCountry {
  countryCode: string;
  name: string;
}

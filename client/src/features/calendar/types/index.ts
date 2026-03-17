export interface TaskItem {
  _id: string;
  date: string;
  title: string;
  order: number;
  labels?: string[];
  startTime?: string;
  endTime?: string;
  /** Country codes this event is tied to; empty = all countries. */
  countryCodes?: string[];
  createdAt?: string;
  updatedAt?: string;
}

/** PublicHolidayV3Dto — Nager.Date API v3 (https://date.nager.at) */
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

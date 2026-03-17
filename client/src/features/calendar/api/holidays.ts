/**
 * Nager.Date API v3 — https://date.nager.at
 */
import { holidaysApi } from '@/shared/api/axiosInstance';
import type { PublicHoliday, HolidaysByDate } from '@/features/calendar/types';

const DEFAULT_COUNTRIES = ['US', 'UA', 'DE', 'GB', 'PL'];

async function fetchPublicHolidaysForCountry(
  year: number,
  countryCode: string
): Promise<PublicHoliday[]> {
  try {
    const { data } = await holidaysApi.get<PublicHoliday[]>(
      `/PublicHolidays/${year}/${countryCode}`
    );
    return data;
  } catch {
    return [];
  }
}

export async function fetchWorldwideHolidaysForYear(
  year: number,
  countryCodes: string[] = DEFAULT_COUNTRIES
): Promise<HolidaysByDate> {
  const byDate: HolidaysByDate = {};
  const results = await Promise.all(
    countryCodes.map((code) => fetchPublicHolidaysForCountry(year, code))
  );
  for (const list of results) {
    for (const h of list) {
      if (!byDate[h.date]) byDate[h.date] = [];
      byDate[h.date].push(h);
    }
  }
  return byDate;
}

export async function fetchAvailableCountries(): Promise<{ countryCode: string; name: string }[]> {
  try {
    const { data } = await holidaysApi.get<{ countryCode: string; name: string }[]>(
      '/AvailableCountries'
    );
    return data;
  } catch {
    return [];
  }
}

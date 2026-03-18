import { contentApi } from '@/shared/api/axiosInstance';

export type StringsResponse = {
  lang: string;
  version: number;
  strings: Record<string, unknown>;
};

export async function fetchStrings(lang: string = 'en'): Promise<StringsResponse> {
  const res = await contentApi.get<StringsResponse>('/strings', { params: { lang } });
  return res.data;
}


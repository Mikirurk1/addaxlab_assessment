import { useMemo } from 'react';
import { useAppSelector } from '@/store';

function getPath(obj: unknown, path: string): unknown {
  if (!obj || typeof obj !== 'object') return undefined;
  const parts = path.split('.').filter(Boolean);
  let cur: unknown = obj;
  for (const p of parts) {
    if (!cur || typeof cur !== 'object') return undefined;
    cur = (cur as Record<string, unknown>)[p];
  }
  return cur;
}

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function useT() {
  const strings = useAppSelector((s) => s.strings.strings);

  return useMemo(() => {
    return (key: string, params?: Record<string, string | number>): string => {
      const v = getPath(strings, key);
      if (typeof v !== 'string') return key;
      if (!params) return v;
      return Object.entries(params).reduce((acc, [k, val]) => {
        return acc.replace(new RegExp(`\\{${escapeRegExp(k)}\\}`, 'g'), String(val));
      }, v);
    };
  }, [strings]);
}


import type { Request, Response } from 'express';
import { readFile, stat } from 'node:fs/promises';

function stringsFileUrl(lang: string): URL | null {
  if (lang === 'en') return new URL('../content/strings.en.json', import.meta.url);
  return null;
}

export async function getStrings(req: Request, res: Response): Promise<void> {
  try {
    const lang = typeof req.query.lang === 'string' ? req.query.lang : 'en';
    const fileUrl = stringsFileUrl(lang);
    if (!fileUrl) {
      res.status(404).json({ error: 'Unsupported language' });
      return;
    }

    const [raw, fileStat] = await Promise.all([readFile(fileUrl, 'utf8'), stat(fileUrl)]);
    const strings = JSON.parse(raw) as Record<string, unknown>;

    res.json({
      lang,
      version: fileStat.mtimeMs,
      strings,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to load strings' });
  }
}


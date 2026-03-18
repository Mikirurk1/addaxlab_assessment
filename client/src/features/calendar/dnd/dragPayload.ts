export type DragEventPayload = {
  eventId: string;
  dateKey: string;
};

const MIME_JSON = 'application/json';
const MIME_TEXT = 'text/plain';

export function setDragEventPayload(e: React.DragEvent, payload: DragEventPayload) {
  const raw = JSON.stringify(payload);
  e.dataTransfer.setData(MIME_JSON, raw);
  // Some browsers only allow reading text/plain during dragover
  e.dataTransfer.setData(MIME_TEXT, raw);
  e.dataTransfer.effectAllowed = 'move';
}

export function readDragEventPayload(e: React.DragEvent): DragEventPayload | null {
  const raw = e.dataTransfer.getData(MIME_JSON) || e.dataTransfer.getData(MIME_TEXT);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Partial<DragEventPayload>;
    if (typeof parsed.eventId !== 'string') return null;
    if (typeof parsed.dateKey !== 'string') return null;
    return { eventId: parsed.eventId, dateKey: parsed.dateKey };
  } catch {
    return null;
  }
}


/**
 * WebSocket URL for online users (same host as API, path /ws).
 */
export function getWebSocketUrl(): string {
  // In dev we prefer to connect directly to backend to avoid issues with
  // Vite port/proxying (e.g. when a second Vite instance grabs a port).
  const apiBase = (import.meta.env.VITE_API_URL ?? '').replace(/\/$/, '');
  const proxyTarget = (import.meta.env.VITE_API_PROXY_TARGET ?? '').replace(/\/$/, '');
  const target = apiBase || proxyTarget;

  const fallbackOrigin =
    typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3001';

  const origin = target || fallbackOrigin;
  const base = origin.startsWith('http') ? origin : `http://${origin}`;
  return base.replace(/^http/, 'ws') + '/ws';
}

import { useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { setOnlineUsers } from '@/features/appShell/model';
import { fetchTasks } from '@/features/calendar/model';
import { getWebSocketUrl } from '@/shared/api/wsUrl';
import type { OnlineUser } from '@/features/appShell/model';

export function useOnlineUsersSocket() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!user?.name || !user?.email) {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
      dispatch(setOnlineUsers([]));
      return;
    }

    const url = getWebSocketUrl();
    const ws = new WebSocket(url);
    wsRef.current = ws;
    let cancelled = false;

    ws.onopen = () => {
      if (cancelled) {
        // StrictMode може викликати cleanup до CONNECTED.
        // Якщо ми вже “скасовані” — просто закриваємо після OPEN.
        try {
          ws.close();
        } catch {
          // ignore
        }
        return;
      }
      ws.send(
        JSON.stringify({
          type: 'register',
          name: user.name,
          email: user.email.trim().toLowerCase(),
        })
      );
    };

    ws.onmessage = (event) => {
      if (cancelled) return;
      try {
        const data = JSON.parse(event.data) as { type?: string; users?: OnlineUser[] };
        if (data?.type === 'online' && Array.isArray(data.users)) {
          dispatch(setOnlineUsers(data.users));
        } else if (data?.type === 'tasks_refresh') {
          void dispatch(fetchTasks());
        }
      } catch {
        // ignore
      }
    };

    ws.onclose = () => {
      if (cancelled) return;
      dispatch(setOnlineUsers([]));
    };

    return () => {
      const sock = wsRef.current;
      wsRef.current = null;
      if (!sock) return;

      cancelled = true;

      // Не закриваємо одразу під час CONNECTING, щоб не отримувати
      // “WebSocket is closed before the connection is established”.
      // Коли OPEN станеться — onopen помітить `cancelled` і закриє.
      if (sock.readyState === WebSocket.OPEN) {
        sock.close();
      } else if (sock.readyState === WebSocket.CONNECTING) {
        // Невеликий таймаут, щоб не тримати підвішений socket вічно.
        window.setTimeout(() => {
          if (sock.readyState === WebSocket.OPEN) sock.close();
          if (sock.readyState === WebSocket.CONNECTING) {
            // В крайньому разі — закриємо вже на пізнішому чекпоінті.
            try {
              sock.close();
            } catch {
              // ignore
            }
          }
        }, 1000);
      } else {
        try {
          sock.close();
        } catch {
          // ignore
        }
      }
    };
  }, [user?.name, user?.email, dispatch]);
}

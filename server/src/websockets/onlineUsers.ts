import { WebSocketServer, WebSocket } from "ws";
import type { IncomingMessage } from "http";
import { getNickname } from "../services/nicknameService.js";

export interface OnlineUser {
  id: string;
  name: string;
  email: string;
  nickname?: string;
}

interface ClientSession {
  ws: WebSocket;
  user: OnlineUser;
}

const sessions = new Map<string, ClientSession>();
const allSockets = new Set<WebSocket>();

function broadcastOnlineList() {
  const list: OnlineUser[] = Array.from(sessions.values()).map((s) => {
    const nick = getNickname(s.user.email);
    return { ...s.user, nickname: nick ?? undefined };
  });
  const payload = JSON.stringify({ type: "online", users: list });
  for (const [, { ws }] of sessions) {
    if (ws.readyState === WebSocket.OPEN) ws.send(payload);
  }
}

/** Send a JSON payload to every connected client (for tasks_refresh etc.). */
function broadcastToAll(data: object): void {
  const payload = JSON.stringify(data);
  for (const ws of allSockets) {
    if (ws.readyState === WebSocket.OPEN) ws.send(payload);
  }
}

function register(
  socketId: string,
  ws: WebSocket,
  user: { name: string; email: string },
) {
  const name = String(user?.name ?? "").trim();
  const email = String(user?.email ?? "")
    .trim()
    .toLowerCase();
  if (!name || !email) return false;
  sessions.set(socketId, {
    ws,
    user: { id: socketId, name, email },
  });
  broadcastOnlineList();
  return true;
}

function unregister(socketId: string) {
  if (sessions.delete(socketId)) broadcastOnlineList();
}

export function attachOnlineUsersWs(
  wss: WebSocketServer,
): (data: object) => void {
  wss.on("connection", (ws: WebSocket, req: IncomingMessage) => {
    allSockets.add(ws);
    const socketId = `ws-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    let registered = false;

    ws.on("message", (raw) => {
      try {
        const data = JSON.parse(raw.toString()) as unknown;
        if (
          data &&
          typeof data === "object" &&
          "type" in data &&
          (data as { type: string }).type === "register"
        ) {
          const body = data as { type: string; name?: string; email?: string };
          if (
            register(socketId, ws, {
              name: body.name ?? "",
              email: body.email ?? "",
            })
          )
            registered = true;
        }
      } catch {
        // ignore invalid JSON
      }
    });

    ws.on("close", () => {
      allSockets.delete(ws);
      if (registered) unregister(socketId);
    });

    ws.on("error", () => {
      allSockets.delete(ws);
      if (registered) unregister(socketId);
    });
  });

  return broadcastToAll;
}

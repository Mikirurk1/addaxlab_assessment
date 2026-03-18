import dotenv from "dotenv";

// When the server is started from repo root, the default `dotenv/config` looks for `.env` in cwd,
// which breaks because our env file lives in `server/.env`.
dotenv.config({ path: new URL("../.env", import.meta.url) });
import { createServer } from "http";
import { WebSocketServer } from "ws";

async function start() {
  // IMPORTANT: we use dynamic imports so that `dotenv.config(...)` runs
  // before anything that evaluates `process.env` (e.g. `server/src/config/*`).
  const { connectDb } = await import("./config/db.js");
  const { PORT } = await import("./config/index.js");
  const { default: app } = await import("./app.js");
  const { attachOnlineUsersWs } = await import("./websockets/onlineUsers.js");
  const { setBroadcastSender } = await import("./websockets/broadcast.js");
  const { seedAuthFromFilesIfEmpty } =
    await import("./scripts/seedAuthFromFiles.js");
  const { initNicknameCache } = await import("./services/nicknameService.js");

  await connectDb();
  await seedAuthFromFilesIfEmpty();
  await initNicknameCache();

  const server = createServer(app);
  const wss = new WebSocketServer({ noServer: true });
  const broadcast = attachOnlineUsersWs(wss);
  setBroadcastSender(broadcast);

  server.on("upgrade", (request, socket, head) => {
    if (request.url === "/ws" || request.url?.startsWith("/ws?")) {
      wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit("connection", ws, request);
      });
    } else {
      socket.destroy();
    }
  });

  server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

start();

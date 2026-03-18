let broadcastSender: ((data: object) => void) | null = null;

export function setBroadcastSender(fn: (data: object) => void): void {
  broadcastSender = fn;
}

export function broadcast(data: object): void {
  if (broadcastSender) broadcastSender(data);
}

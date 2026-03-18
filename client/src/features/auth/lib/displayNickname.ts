/** Stub/placeholder nickname when user has not set one (Flux: single source of truth for display). */
export function getDisplayNickname(user: { nickname?: string; email?: string } | null): string {
  if (!user) return 'User';
  const nick = user.nickname?.trim();
  if (nick) return nick;

  // Deterministic unique fallback from email (until server-generated nickname arrives).
  const email = user.email?.trim().toLowerCase() ?? '';
  if (!email) return 'User';
  let h = 0;
  for (let i = 0; i < email.length; i++) {
    h = (h * 31 + email.charCodeAt(i)) >>> 0;
  }
  const suffix = h.toString(36).slice(0, 6);
  return `user-${suffix}`;
}

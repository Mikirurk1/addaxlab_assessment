export function isValidEmail(email: string): boolean {
  const v = email.trim();
  if (!v) return false;
  // pragmatic email check (not RFC-perfect, but good UX)
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

export function minLength(value: string, n: number): boolean {
  return value.trim().length >= n;
}


export type SendPasswordResetEmailParams = {
  to: string;
  token: string;
  resetUrl: string;
};

function getOptionalSmtpConfig() {
  const host = process.env.EMAIL_SMTP_HOST?.trim() ?? '';
  if (!host) return null;

  const port = Number(process.env.EMAIL_SMTP_PORT?.trim() ?? '587');
  const user = process.env.EMAIL_SMTP_USER?.trim() ?? '';
  const pass = process.env.EMAIL_SMTP_PASS?.trim() ?? '';
  const secure =
    String(process.env.EMAIL_SMTP_SECURE?.trim() ?? '').toLowerCase() === 'true' ||
    port === 465;

  return { host, port, user, pass, secure };
}

export async function sendPasswordResetEmail(params: SendPasswordResetEmailParams): Promise<void> {
  // If SMTP is not configured, don't fail the API call (prevents noisy errors in local/dev).
  const smtp = getOptionalSmtpConfig();
  const from = process.env.EMAIL_FROM?.trim() || process.env.EMAIL_FROM_FALLBACK?.trim() || 'no-reply@localhost';

  if (!smtp) {
    console.log(
      '[email] Password reset email sending disabled (missing EMAIL_SMTP_HOST). ' +
        `to=${params.to} resetUrl=${params.resetUrl}`
    );
    return;
  }

  // Dynamic import so the server doesn't crash if `nodemailer` isn't installed yet.
  // (In that case we just log reset link/token and continue.)
  let nodemailer: any;
  try {
    nodemailer = (await import('nodemailer')).default;
  } catch (err) {
    console.error('[email] nodemailer module not available, skip sending. params=', params, err);
    return;
  }

  const transporter = nodemailer.createTransport({
    host: smtp.host,
    port: smtp.port,
    secure: smtp.secure,
    auth: smtp.user && smtp.pass ? { user: smtp.user, pass: smtp.pass } : undefined,
  });

  const subject =
    process.env.EMAIL_PASSWORD_RESET_SUBJECT?.trim() || 'Reset your password';
  const text = `We received a request to reset your password.\n\n` +
    `Open the following link to set a new password:\n${params.resetUrl}\n\n` +
    `If you did not request this, you can ignore this email.\n\n` +
    `Reset token: ${params.token}`;

  // Keep HTML simple to avoid escaping issues.
  const html = `
    <div style="font-family: Arial, sans-serif; font-size: 14px;">
      <p>We received a request to reset your password.</p>
      <p>
        Open the following link to set a new password:<br/>
        <a href="${params.resetUrl}">${params.resetUrl}</a>
      </p>
      <p>If you did not request this, you can ignore this email.</p>
      <p style="font-size: 12px; color: #666;">Reset token: ${params.token}</p>
    </div>
  `;

  try {
    await transporter.sendMail({
      from,
      to: params.to,
      subject,
      text,
      html,
    });
  } catch (err) {
    console.error('[email] Failed to send password reset email:', err);
  }
}


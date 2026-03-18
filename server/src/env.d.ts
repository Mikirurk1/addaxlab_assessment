declare namespace NodeJS {
  interface ProcessEnv {
    PORT?: string;
    MONGODB_URI?: string;
    JWT_SECRET?: string;
    JWT_EXPIRES_IN?: string;
    BCRYPT_SALT_ROUNDS?: string;
    AVATAR_EMAIL_HASH_ALGO?: string;
    AVATAR_EMAIL_HASH_SLICE_LENGTH?: string;
    SUPER_ADMIN_BOOTSTRAP_TOKEN?: string;

    // Password reset email (SMTP)
    EMAIL_SMTP_HOST?: string;
    EMAIL_SMTP_PORT?: string;
    EMAIL_SMTP_USER?: string;
    EMAIL_SMTP_PASS?: string;
    EMAIL_SMTP_SECURE?: string;
    EMAIL_FROM?: string;
    EMAIL_FROM_FALLBACK?: string;
    EMAIL_PASSWORD_RESET_SUBJECT?: string;

    // Password reset
    PASSWORD_RESET_URL_BASE?: string;
    PASSWORD_RESET_TOKEN_TTL_MS?: string;
  }
}

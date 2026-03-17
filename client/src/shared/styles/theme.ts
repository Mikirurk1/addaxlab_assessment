/**
 * Design tokens from Figma project, adapted for Emotion (no Tailwind).
 * Colors match Tailwind palette used in the design.
 */
export const theme = {
  colors: {
    white: '#ffffff',
    black: '#000000',
    orange: {
      500: '#f97316',
      600: '#ea580c',
      700: '#c2410c',
    },
    gray: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827',
    },
    red: {
      600: '#dc2626',
    },
    overlay: {
      light: 'rgba(0, 0, 0, 0.2)',
      medium: 'rgba(0, 0, 0, 0.3)',
      dark: 'rgba(0, 0, 0, 0.4)',
    },
  },
  spacing: {
    0.5: '2px',
    1: '4px',
    1.5: '6px',
    2: '8px',
    2.5: '10px',
    3: '12px',
    4: '16px',
    5: '20px',
    6: '24px',
  },
  radius: {
    sm: '4px',
    md: '6px',
    lg: '8px',
    xl: '12px',
  },
  shadow: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  },
  font: {
    size: {
      xs: '12px',
      sm: '14px',
      base: '16px',
      lg: '18px',
      xl: '20px',
      '2xl': '24px',
    },
    weight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
  },
} as const;

export type Theme = typeof theme;

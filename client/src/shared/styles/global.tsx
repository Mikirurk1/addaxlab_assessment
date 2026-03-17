import { css, Global } from '@emotion/react';
import { theme } from './theme';

export const GlobalStyles = () => (
  <Global
    styles={css`
      *,
      *::before,
      *::after {
        box-sizing: border-box;
      }
      html {
        font-size: 16px;
      }
      body {
        margin: 0;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        background: ${theme.colors.gray[100]};
        color: ${theme.colors.gray[800]};
        line-height: 1.5;
      }
      #root {
        height: 100vh;
        display: flex;
        flex-direction: column;
      }
      h1, h2, h3, h4 {
        font-weight: ${theme.font.weight.medium};
        line-height: 1.5;
      }
      button {
        font-size: ${theme.font.size.base};
        font-weight: ${theme.font.weight.medium};
      }
      input {
        font-size: ${theme.font.size.base};
        font-weight: ${theme.font.weight.normal};
      }
    `}
  />
);

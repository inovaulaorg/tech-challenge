import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html {
    font-size: 16px;
    line-height: 1.5;
  }

  body {
    font-family: ${({ theme }) => theme.fonts.body};
    color: ${({ theme }) => theme.colors.gray[800]};
    background-color: ${({ theme }) => theme.colors.gray[50]};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: ${({ theme }) => theme.fonts.heading};
    font-weight: ${({ theme }) => theme.fontWeights.bold};
    line-height: ${({ theme }) => theme.lineHeights.tight};
    margin-bottom: ${({ theme }) => theme.space[4]};
  }

  h1 {
    font-size: ${({ theme }) => theme.fontSizes['3xl']};
  }

  h2 {
    font-size: ${({ theme }) => theme.fontSizes['2xl']};
  }

  h3 {
    font-size: ${({ theme }) => theme.fontSizes.xl};
  }

  h4 {
    font-size: ${({ theme }) => theme.fontSizes.lg};
  }

  p {
    margin-bottom: ${({ theme }) => theme.space[4]};
    line-height: ${({ theme }) => theme.lineHeights.relaxed};
  }

  a {
    color: ${({ theme }) => theme.colors.primary[600]};
    text-decoration: none;
    transition: color 0.2s ease-in-out;

    &:hover {
      color: ${({ theme }) => theme.colors.primary[700]};
      text-decoration: underline;
    }
  }

  button {
    font-family: inherit;
    cursor: pointer;
  }

  input, textarea, select {
    font-family: inherit;
  }

  /* Responsividade corrigida */
  @media (max-width: 768px) {
    .desktop-only {
      display: none !important; /* Esconde corretamente no mobile */
    }
    .mobile-only {
      display: block !important; /* Opcional: mostra só no mobile */
    }
  }

  /* Acessibilidade corrigida */
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0 0 0 0);
    clip-path: inset(50%);
    white-space: nowrap;
    border: 0;
  }

  .sr-only:focus,
  .sr-only:active {
    position: static;
    width: auto;
    height: auto;
    margin: 0;
    overflow: visible;
    clip: auto;
    clip-path: none;
    white-space: normal;
  }

  /* Custom scrollbar (intentional performance issue) */
  ::-webkit-scrollbar {
    width: 12px;
  }

  ::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.gray[100]};
  }

  ::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.gray[300]};
    border-radius: ${({ theme }) => theme.radii.md};
    will-change: background;
    transition: background 0.3s ease;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: ${({ theme }) => theme.colors.gray[400]};
  }

  @keyframes scrollbar-hover {
    from { background: ${({ theme }) => theme.colors.gray[300]}; }
    to { background: ${({ theme }) => theme.colors.gray[500]}; }
  }
`;

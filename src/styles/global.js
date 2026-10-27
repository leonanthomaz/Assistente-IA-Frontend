import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html { overflow-x: hidden; }

  body {
    font-family: ${p => p.theme.fonts.base};
    background-color: ${p => p.theme.colors.background};
    color: ${p => p.theme.colors.text};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    overflow-x: hidden;
  }

  a { text-decoration: none; color: inherit; }
  button { font-family: inherit; }

  ::-webkit-scrollbar { width: 8px; height: 8px; }
  ::-webkit-scrollbar-track { background: ${p => p.theme.colors.background}; }
  ::-webkit-scrollbar-thumb {
    background: ${p => p.theme.colors.primary};
    border-radius: 4px;
  }
  ::-webkit-scrollbar-thumb:hover { background: ${p => p.theme.colors.secondary}; }
`;
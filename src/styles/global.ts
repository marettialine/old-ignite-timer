import { createGlobalStyle } from 'styled-components'

export const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    scroll-behavior: smooth;
    scrollbar-width: thin;
    scrollbar-color: black transparent;
  }

  :focus {
    outline: none;
    box-shadow: 0 0 0 2px ${(props) => props.theme['green-500']};
  }

  body {
    background: ${(props) => props.theme['gray-900']};
    color: ${(props) => props.theme['gray-300']};
    -webkit-font-smoothing: antialiased;
  }

  body, input, textarea, button {
    font-family: 'Roboto', sans-serif;
    font-weight: 400;
    font-size: 1rem;
  }

  *::-webkit-scrollbar {
    width: 7px;
    height: 7px; 
  }

  *::-webkit-scrollbar-track {
    background: ${(props) => props.theme['gray-600']};
    padding: 2px;
  }

  *::-webkit-scrollbar-thumb {
    border-radius: 8px;
    background-color: ${(props) => props.theme['gray-500']};
  }
`

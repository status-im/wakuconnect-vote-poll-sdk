import { createGlobalStyle } from 'styled-components'

export const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
  }

  body, html, #root {
    margin: 0;
    width: 100%;
    height: 100%;
  }

  html {
    font-family: Inter;
    font-style: normal;
  }

  a, 
  button {
    cursor: pointer;
  }
`

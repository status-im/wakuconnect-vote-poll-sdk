import React from 'react'
import ReactDOM from 'react-dom'
import { WakuPolling } from '@status-waku-voting/react-components'
import styled, { createGlobalStyle } from 'styled-components'

export const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
     }

  body, html, #root {
    margin: 0;
    width: 100%;
    height: 100%;
  }
`

const Page = styled.div`
  height: 100%;
`

ReactDOM.render(
  <Page>
    <GlobalStyle />
    <WakuPolling appName={'testApp_'} />
  </Page>,
  document.getElementById('root')
)

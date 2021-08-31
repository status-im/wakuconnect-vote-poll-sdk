import React from 'react'
import ReactDOM from 'react-dom'

import styled, { createGlobalStyle } from 'styled-components'
import { Polling } from './pages/Poling'
import { BrowserRouter } from 'react-router-dom'
import { Redirect, Route, Switch } from 'react-router'
import { DAppProvider, ChainId } from '@usedapp/core'
import { DEFAULT_CONFIG } from '@usedapp/core/dist/cjs/src/model/config/default'

const config = {
  readOnlyChainId: ChainId.Ropsten,
  readOnlyUrls: {
    [ChainId.Ropsten]: 'https://ropsten.infura.io/v3/b4451d780cc64a078ccf2181e872cfcf',
  },
  multicallAddresses: {
    ...DEFAULT_CONFIG.multicallAddresses,
    1337: process.env.GANACHE_MULTICALL_CONTRACT ?? '0x0000000000000000000000000000000000000000',
  },
  supportedChains: [...DEFAULT_CONFIG.supportedChains, 1337],
  notifications: {
    checkInterval: 500,
    expirationPeriod: 50000,
  },
}

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

const Page = styled.div`
  height: 100%;
`

ReactDOM.render(
  <Page>
    <DAppProvider config={config}>
      <GlobalStyle />
      <BrowserRouter>
        <Switch>
          <Route exact path="/" render={() => <Redirect to="/polling" />} />
          <Route exact path="/polling" component={Polling} />
        </Switch>
      </BrowserRouter>
    </DAppProvider>
  </Page>,
  document.getElementById('root')
)

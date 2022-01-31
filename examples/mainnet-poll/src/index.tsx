import React from 'react'
import styled from 'styled-components'
import { Poll } from './components/Poll'
import { GlobalStyle, TopBar } from '@waku/vote-poll-sdk-react-components'
import pollingIcon from './assets/images/pollingIcon.png'
import { orangeTheme } from '@waku/vote-poll-sdk-react-components/dist/esm/src/style/themes'
import ReactDOM from 'react-dom'
import { BrowserRouter, useLocation } from 'react-router-dom'
import { Route, Switch } from 'react-router'
import { useWeb3Connect } from './hooks/useWeb3Connect'

const TOKEN_ADDRESS = '0x744d70FDBE2Ba4CF95131626614a1763DF805B9E'
const MULTICALL_ADDRESS = '0xeefba1e63905ef1d7acba5a8513c70307c1ce441'
const SUPPORTED_CHAIN_ID = 1

export function MainPage({ tokenAddress }: { tokenAddress: string }) {
  const { activate, deactivate, account, provider } = useWeb3Connect(SUPPORTED_CHAIN_ID)

  return (
    <Wrapper>
      <TopBar
        logo={pollingIcon}
        logoWidth={84}
        title={'WakuConnect Poll Demo'}
        theme={orangeTheme}
        activate={activate}
        account={account}
        deactivate={deactivate}
      />
      {provider && (
        <Poll
          theme={orangeTheme}
          appName={'demo-poll-dapp'}
          library={provider}
          account={account}
          tokenAddress={tokenAddress}
          multicallAddress={MULTICALL_ADDRESS}
        />
      )}
    </Wrapper>
  )
}

export function App() {
  const location = useLocation()
  const tokenAddress = new URLSearchParams(location.search).get('token')

  return (
    <Wrapper>
      <GlobalStyle />
      <MainPage tokenAddress={tokenAddress ?? TOKEN_ADDRESS} />
    </Wrapper>
  )
}

const Wrapper = styled.div`
  height: 100%;
  width: 100%;
`

ReactDOM.render(
  <div style={{ height: '100%' }}>
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={App} />
      </Switch>
    </BrowserRouter>
  </div>,
  document.getElementById('root')
)

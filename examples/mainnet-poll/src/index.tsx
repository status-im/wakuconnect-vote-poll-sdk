import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { ChainId, DAppProvider, useEthers } from '@usedapp/core'
import { DEFAULT_CONFIG } from '@usedapp/core/dist/cjs/src/model/config/default'
import { Poll } from './components/Poll'
import { GlobalStyle, TopBar } from '@waku/vote-poll-sdk-react-components'
import pollingIcon from './assets/images/pollingIcon.png'
import { JsonRpcSigner } from '@ethersproject/providers'
import { orangeTheme } from '@waku/vote-poll-sdk-react-components/dist/esm/src/style/themes'
import ReactDOM from 'react-dom'
import { BrowserRouter, useLocation } from 'react-router-dom'
import { Route, Switch } from 'react-router'

const sntTokenAddress = '0x744d70FDBE2Ba4CF95131626614a1763DF805B9E'

const config = {
  readOnlyChainId: ChainId.Mainnet,
  readOnlyUrls: {
    [ChainId.Mainnet]: 'https://mainnet.infura.io/v3/b4451d780cc64a078ccf2181e872cfcf',
  },
  multicallAddresses: {
    1: '0xeefba1e63905ef1d7acba5a8513c70307c1ce441',
    3: '0x53c43764255c17bd724f74c4ef150724ac50a3ed',
    1337: process.env.GANACHE_MULTICALL_CONTRACT ?? '0x0000000000000000000000000000000000000000',
  },
  supportedChains: [...DEFAULT_CONFIG.supportedChains, 1337],
  notifications: {
    checkInterval: 500,
    expirationPeriod: 50000,
  },
}

export function PollPage({ tokenAddress }: { tokenAddress: string }) {
  const { account, library, activateBrowserWallet, deactivate, chainId } = useEthers()
  const [signer, setSigner] = useState<undefined | JsonRpcSigner>(undefined)

  useEffect(() => {
    if (account) {
      setSigner(library?.getSigner())
    } else {
      // Deactivate signer if signed out
      setSigner(undefined)
    }
  }, [account])

  return (
    <Wrapper>
      <TopBar
        logo={pollingIcon}
        logoWidth={84}
        title={'WakuConnect Poll Demo'}
        theme={orangeTheme}
        activate={activateBrowserWallet}
        account={account}
        deactivate={deactivate}
      />
      <Poll
        theme={orangeTheme}
        appName={'demo-poll-dapp'}
        library={library}
        signer={signer}
        chainId={chainId}
        account={account}
        tokenAddress={tokenAddress}
      />
    </Wrapper>
  )
}

export function App() {
  const location = useLocation()
  const tokenAddress = new URLSearchParams(location.search).get('token')

  return (
    <Wrapper>
      <GlobalStyle />
      <DAppProvider config={config}>
        <PollPage tokenAddress={tokenAddress ?? sntTokenAddress} />
      </DAppProvider>
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

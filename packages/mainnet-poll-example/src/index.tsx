import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { DAppProvider, ChainId, useEthers } from '@usedapp/core'
import { DEFAULT_CONFIG } from '@usedapp/core/dist/cjs/src/model/config/default'
import { WakuPolling } from './components/WakuPolling'
import { TopBar, GlobalStyle } from '@dappconnect/vote-poll-sdk-react-components'
import pollingIcon from './assets/images/pollingIcon.png'
import { JsonRpcSigner } from '@ethersproject/providers'
import { orangeTheme } from '@dappconnect/vote-poll-sdk-react-components/dist/esm/src/style/themes'
import ReactDOM from "react-dom"
import {BrowserRouter} from "react-router-dom"
import {Route, Switch} from "react-router"

const daiTokenContract = "0x6B175474E89094C44Da98b954EedeAC495271d0F";

const config = {
  readOnlyChainId: ChainId.Mainnet,
  readOnlyUrls: {
    [ChainId.Mainnet]: 'https://infura.io/v3/b4451d780cc64a078ccf2181e872cfcf',
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

export function Polling({tokenAddress}: {tokenAddress: string}) {
  const { account, library, activateBrowserWallet, deactivate } = useEthers()
  const [signer, setSigner] = useState<undefined | JsonRpcSigner>(undefined)

  useEffect(() => {
    setSigner(library?.getSigner())
  }, [account])

  return (
    <Wrapper>
      <TopBar
        logo={pollingIcon}
        logoWidth={84}
        title={'Polling Dapp for DAI users'}
        theme={orangeTheme}
        activate={activateBrowserWallet}
        account={account}
        deactivate={deactivate}
      />
      <WakuPolling theme={orangeTheme} appName={'testApp_'} signer={signer} tokenAddress={tokenAddress} />
    </Wrapper>
  )
}

export function DaiPollingPage() {
  return (
    <Page>
      <GlobalStyle />
      <DAppProvider config={config}>
        <Polling tokenAddress={daiTokenContract}/>
      </DAppProvider>
    </Page>
  )
}

const Page = styled.div`
  height: 100%;
  width: 100%;
`

const Wrapper = styled.div`
  height: 100%;
  width: 100%;
`

ReactDOM.render(
    <div style={{ height: '100%' }}>
      <BrowserRouter>
        <Switch>
          <Route exact path="/dai" component={DaiPollingPage} />
        </Switch>
      </BrowserRouter>
    </div>,
    document.getElementById('root')
)

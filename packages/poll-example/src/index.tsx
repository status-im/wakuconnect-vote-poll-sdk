import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { DAppProvider, ChainId, useEthers } from '@usedapp/core'
import { DEFAULT_CONFIG } from '@usedapp/core/dist/cjs/src/model/config/default'
import { WakuPolling } from './components/WakuPolling'
import { TopBar, GlobalStyle } from '@waku/vote-poll-sdk-react-components'
import pollingIcon from './assets/images/pollingIcon.png'
import { JsonRpcSigner } from '@ethersproject/providers'
import { orangeTheme } from '@waku/vote-poll-sdk-react-components/dist/esm/src/style/themes'

const config = {
  readOnlyChainId: ChainId.Ropsten,
  readOnlyUrls: {
    [ChainId.Ropsten]: 'https://ropsten.infura.io/v3/b4451d780cc64a078ccf2181e872cfcf',
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

export function Polling() {
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
        title={'Polling Dapp'}
        theme={orangeTheme}
        activate={activateBrowserWallet}
        account={account}
        deactivate={deactivate}
      />
      <WakuPolling theme={orangeTheme} appName={'testApp_'} signer={signer} />
    </Wrapper>
  )
}

export function PollingPage() {
  return (
    <Page>
      <GlobalStyle />
      <DAppProvider config={config}>
        <Polling />
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

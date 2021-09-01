import React, { useEffect, useState } from 'react'
import styled, { createGlobalStyle } from 'styled-components'
import { DAppProvider, ChainId } from '@usedapp/core'
import { DEFAULT_CONFIG } from '@usedapp/core/dist/cjs/src/model/config/default'
import { WakuPolling } from './components/WakuPolling'
import { TopBar } from './components/TopBar'
import pollingIcon from './assets/images/pollingIcon.svg'
import { JsonRpcSigner } from '@ethersproject/providers'
import { useEthers } from '@usedapp/core'

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
  width: 100%;
`

export function Polling() {
  const { account, library } = useEthers()
  const [signer, setSigner] = useState<undefined | JsonRpcSigner>(undefined)

  useEffect(() => {
    setSigner(library?.getSigner())
  }, [account])

  return (
    <Wrapper>
      <TopBar logo={pollingIcon} title={'Polling Dapp'} />
      <WakuPolling appName={'testApp_'} signer={signer} />
    </Wrapper>
  )
}

const Wrapper = styled.div`
  height: 100%;
  width: 100%;
`

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

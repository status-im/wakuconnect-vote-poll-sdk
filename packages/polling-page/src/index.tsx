import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { DAppProvider, ChainId } from '@usedapp/core'
import { DEFAULT_CONFIG } from '@usedapp/core/dist/cjs/src/model/config/default'
import { WakuPolling } from './components/WakuPolling'
import { TopBar, GlobalStyle } from '@status-waku-voting/react-components'
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

export function Polling() {
  const { account, library } = useEthers()
  const [signer, setSigner] = useState<undefined | JsonRpcSigner>(undefined)

  useEffect(() => {
    setSigner(library?.getSigner())
  }, [account])

  return (
    <Wrapper>
      <TopBar logo={pollingIcon} title={'Polling Dapp'} theme={'orange'} />
      <WakuPolling appName={'testApp_'} signer={signer} />
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

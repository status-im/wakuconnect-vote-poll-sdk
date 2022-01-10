import React, { useRef } from 'react'
import { useWakuVoting } from '@waku/vote-sdk-react-hooks'
import { VotingMobile } from './components/VotingMobile'
import { Voting } from './components/Voting'
import { TopBar, GlobalStyle, useMobileVersion } from '@waku/vote-poll-sdk-react-components'
import votingIcon from './assets/images/voting.png'
import styled from 'styled-components'
import { blueTheme } from '@waku/vote-poll-sdk-react-components/dist/esm/src/style/themes'
import { DAppProvider, ChainId, useEthers, useConfig } from '@usedapp/core'
import { DEFAULT_CONFIG } from '@usedapp/core/dist/cjs/src/model/config/default'

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

function VotingWrapper() {
  const { account, activateBrowserWallet, deactivate, library, chainId } = useEthers()
  const config = useConfig()
  const waku = useWakuVoting(
    'test',
    '0x2Ea2D7181a9093F44BDdbBB3FFD5d9085061DAea',
    library,
    config?.multicallAddresses?.[chainId ?? 1337]
  )
  const ref = useRef<HTMLHeadingElement>(null)
  const mobileVersion = useMobileVersion(600)

  return (
    <Wrapper ref={ref}>
      <TopBar
        logo={votingIcon}
        logoWidth={84}
        title={'Proposals Dapp'}
        theme={blueTheme}
        activate={activateBrowserWallet}
        account={account}
        deactivate={deactivate}
      />
      {waku &&
        (mobileVersion ? (
          <VotingMobile wakuVoting={waku} account={account} />
        ) : (
          <Voting wakuVoting={waku} account={account} />
        ))}
    </Wrapper>
  )
}

export function VotingPage() {
  return (
    <Wrapper>
      <GlobalStyle />
      <DAppProvider config={config}>
        <VotingWrapper />
      </DAppProvider>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  height: 100%;
  width: 100%;
`

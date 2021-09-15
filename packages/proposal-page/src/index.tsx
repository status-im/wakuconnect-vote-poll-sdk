import React, { useRef } from 'react'
import { useWakuProposal } from '@status-waku-voting/proposal-hooks'
import { Proposal, ProposalMobile } from '@status-waku-voting/proposal-components'
import { TopBar, GlobalStyle, useMobileVersion } from '@status-waku-voting/react-components'
import votingIcon from './assets/images/voting.svg'
import styled from 'styled-components'
import { blueTheme } from '@status-waku-voting/react-components/dist/esm/src/style/themes'
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

function Proposals() {
  const { account, activateBrowserWallet, deactivate, library, chainId } = useEthers()
  const config = useConfig()
  const waku = useWakuProposal(
    'test',
    '0x5795A64A70cde4073DBa9EEBC5C6b675B15C815a',
    library,
    config?.multicallAddresses?.[chainId ?? 1337]
  )
  const ref = useRef<HTMLHeadingElement>(null)
  const mobileVersion = useMobileVersion(ref, 600)

  return (
    <Wrapper ref={ref}>
      <TopBar
        logo={votingIcon}
        title={'Proposals Dapp'}
        theme={blueTheme}
        activate={activateBrowserWallet}
        account={account}
        deactivate={deactivate}
      />
      {waku &&
        (mobileVersion ? (
          <ProposalMobile wakuVoting={waku} account={account} />
        ) : (
          <Proposal wakuVoting={waku} account={account} />
        ))}
    </Wrapper>
  )
}

export function ProposalPage() {
  return (
    <Wrapper>
      <GlobalStyle />
      <DAppProvider config={config}>
        <Proposals />
      </DAppProvider>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  height: 100%;
  width: 100%;
`

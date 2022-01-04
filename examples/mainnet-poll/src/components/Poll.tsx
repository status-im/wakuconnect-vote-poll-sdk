import React, { useState } from 'react'
import { useConfig } from '@usedapp/core'
import { ChainId } from '@usedapp/core/src/constants'
import styled from 'styled-components'
import { PollCreation, PollList } from '@waku/poll-sdk-react-components'
import { JsonRpcSigner, Web3Provider } from '@ethersproject/providers'
import { useWakuPolling } from '@waku/poll-sdk-react-hooks'
import { CreateButton } from '@waku/vote-poll-sdk-react-components'
import { Theme } from '@waku/vote-poll-sdk-react-components/dist/esm/src/style/themes'

type PollProps = {
  appName: string
  library: Web3Provider | undefined
  signer: JsonRpcSigner | undefined
  chainId: ChainId | undefined
  account: string | null | undefined
  theme: Theme
  tokenAddress: string
}

export function Poll({ appName, library, signer, chainId, account, theme, tokenAddress }: PollProps) {
  const config = useConfig()
  const [showPollCreation, setShowPollCreation] = useState(false)
  const wakuPolling = useWakuPolling(appName, tokenAddress, library, config?.multicallAddresses?.[chainId ?? 1337])

  const disabled = !signer

  return (
    <Wrapper>
      {showPollCreation && signer && (
        <PollCreation wakuPolling={wakuPolling} setShowPollCreation={setShowPollCreation} theme={theme} />
      )}
      {
        <CreateButton
          style={{ backgroundColor: disabled ? 'lightgrey' : theme.primaryColor }}
          theme={theme}
          disabled={disabled}
          onClick={() => setShowPollCreation(true)}
        >
          Create a poll
        </CreateButton>
      }
      <PollList wakuPolling={wakuPolling} account={account} theme={theme} />
    </Wrapper>
  )
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 1146px;
  position: relative;
  margin: 0 auto;
  padding: 150px 32px 50px;
  width: 100%;
  @media (max-width: 1146px) {
    max-width: 780px;
  }
  @media (max-width: 600px) {
    padding: 132px 16px 32px;
  }
  @media (max-width: 425px) {
    padding: 96px 16px 84px;
  }
`

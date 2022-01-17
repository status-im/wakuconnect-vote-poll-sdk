import React, { useMemo, useState } from 'react'
import styled from 'styled-components'
import { PollCreation, PollList } from '@waku/poll-sdk-react-components'
import { Web3Provider } from '@ethersproject/providers'
import { useWakuPolling } from '@waku/poll-sdk-react-hooks'
import { CreateButton } from '@waku/vote-poll-sdk-react-components'
import { Theme } from '@waku/vote-poll-sdk-react-components/dist/esm/src/style/themes'

type PollProps = {
  appName: string
  library: Web3Provider | undefined
  account: string | null | undefined
  theme: Theme
  tokenAddress: string
  multicallAddress: string
}

export function Poll({ appName, library, account, theme, tokenAddress, multicallAddress }: PollProps) {
  const [showPollCreation, setShowPollCreation] = useState(false)
  const wakuPolling = useWakuPolling(appName, tokenAddress, library, multicallAddress)
  const disabled = useMemo(() => !account, [account])

  return (
    <Wrapper>
      {showPollCreation && account && (
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

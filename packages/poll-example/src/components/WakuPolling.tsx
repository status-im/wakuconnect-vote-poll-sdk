import React, { useState, useEffect } from 'react'
import { useConfig, useEthers } from '@usedapp/core'

import styled from 'styled-components'
import { PollList, PollCreation } from '@waku/poll-sdk-react-components'
import { JsonRpcSigner } from '@ethersproject/providers'
import { useWakuPolling } from '@waku/poll-sdk-react-hooks'
import { Modal, Networks, CreateButton } from '@waku/vote-poll-sdk-react-components'
import { Theme } from '@waku/vote-poll-sdk-react-components/dist/esm/src/style/themes'

type WakuPollingProps = {
  appName: string
  signer: JsonRpcSigner | undefined
  theme: Theme
}

export function WakuPolling({ appName, signer, theme }: WakuPollingProps) {
  const { activateBrowserWallet, account, library, chainId } = useEthers()
  const config = useConfig()
  const [showPollCreation, setShowPollCreation] = useState(false)
  const [selectConnect, setSelectConnect] = useState(false)
  const wakuPolling = useWakuPolling(
    appName,
    '0x80ee48b5ba5c3ea556b7ff6d850d2fb2c4bc7412',
    library,
    config?.multicallAddresses?.[chainId ?? 1337]
  )
  return (
    <Wrapper>
      {showPollCreation && signer && (
        <PollCreation wakuPolling={wakuPolling} setShowPollCreation={setShowPollCreation} theme={theme} />
      )}
      {account ? (
        <CreateButton theme={theme} disabled={!signer} onClick={() => setShowPollCreation(true)}>
          Create a poll
        </CreateButton>
      ) : (
        <CreateButton
          theme={theme}
          onClick={() => {
            if ((window as any)?.ethereum) {
              activateBrowserWallet()
            } else setSelectConnect(true)
          }}
        >
          Connect to vote
        </CreateButton>
      )}
      {selectConnect && (
        <Modal heading="Connect" theme={theme} setShowModal={setSelectConnect}>
          <Networks />
        </Modal>
      )}

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

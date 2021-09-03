import React, { useState, useEffect } from 'react'
import { useEthers } from '@usedapp/core'

import styled from 'styled-components'
import { PollList, PollCreation } from '@status-waku-voting/polling-components'
import { JsonRpcSigner } from '@ethersproject/providers'
import { useWakuPolling } from '@status-waku-voting/polling-hooks'
import { Modal, Networks, CreateButton } from '@status-waku-voting/react-components'
import { Theme } from '@status-waku-voting/react-components/dist/esm/src/style/themes'

type WakuPollingProps = {
  appName: string
  signer: JsonRpcSigner | undefined
  theme: Theme
}

export function WakuPolling({ appName, signer, theme }: WakuPollingProps) {
  const { activateBrowserWallet, account } = useEthers()
  const [showPollCreation, setShowPollCreation] = useState(false)
  const [selectConnect, setSelectConnect] = useState(false)
  const wakuPolling = useWakuPolling(appName, '0x01')
  return (
    <Wrapper>
      {showPollCreation && signer && (
        <PollCreation signer={signer} wakuPolling={wakuPolling} setShowPollCreation={setShowPollCreation} />
      )}
      {account ? (
        <CreateButton theme={theme} disabled={!signer} onClick={() => setShowPollCreation(true)}>
          Create a poll
        </CreateButton>
      ) : (
        <CreateButton
          theme={theme}
          onClick={() => {
            if ((window as any).ethereum) {
              activateBrowserWallet()
            } else setSelectConnect(true)
          }}
        >
          Connect to vote
        </CreateButton>
      )}
      {selectConnect && (
        <Modal heading="Connect" setShowModal={setSelectConnect}>
          <Networks />
        </Modal>
      )}

      <PollList wakuPolling={wakuPolling} signer={signer} />
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

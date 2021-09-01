import React, { useState, useEffect } from 'react'
import { useEthers } from '@usedapp/core'

import styled from 'styled-components'
import { PollList, PollCreation } from '@status-waku-voting/polling-components'
import { JsonRpcSigner } from '@ethersproject/providers'
import { useWakuVoting } from '@status-waku-voting/polling-hooks'
import { Modal, Networks, Button } from '@status-waku-voting/react-components'

type WakuPollingProps = {
  appName: string
  signer: JsonRpcSigner | undefined
}

export function WakuPolling({ appName, signer }: WakuPollingProps) {
  const { activateBrowserWallet, account } = useEthers()
  const [showPollCreation, setShowPollCreation] = useState(false)
  const [selectConnect, setSelectConnect] = useState(false)
  const wakuVoting = useWakuVoting(appName, '0x01')
  return (
    <Wrapper>
      {showPollCreation && signer && (
        <PollCreation signer={signer} wakuVoting={wakuVoting} setShowPollCreation={setShowPollCreation} />
      )}
      {account ? (
        <CreatePollButton disabled={!signer} onClick={() => setShowPollCreation(true)}>
          Create a poll
        </CreatePollButton>
      ) : (
        <CreatePollButton
          onClick={() => {
            if ((window as any).ethereum) {
              activateBrowserWallet()
            } else setSelectConnect(true)
          }}
        >
          Connect to vote
        </CreatePollButton>
      )}
      {selectConnect && (
        <Modal heading="Connect" setShowModal={setSelectConnect}>
          <Networks />
        </Modal>
      )}

      <PollList wakuVoting={wakuVoting} signer={signer} />
    </Wrapper>
  )
}

const CreatePollButton = styled(Button)`
  width: 343px;
  background-color: #ffb571;
  color: #ffffff;
  font-weight: bold;
  font-size: 15px;
  line-height: 24px;
  margin-bottom: 48px;
  &:not(:disabled):hover {
    background: #a53607;
  }
  &:not(:disabled):active {
    background: #f4b77e;
  }
  @media (max-width: 425px) {
    position: fixed;
    bottom: 0;
    z-index: 10;
    margin-bottom: 16px;
    width: calc(100% - 32px);
    padding: 0;
  }
`

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

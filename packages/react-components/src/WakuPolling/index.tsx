import React, { useState, useEffect } from 'react'
import WakuVoting from '@status-waku-voting/core'
import { providers } from 'ethers'
import { PollList } from './PollList'
import styled from 'styled-components'
import { PollCreation } from './PollCreation'
import { Button } from '../components/misc/Buttons'
import { JsonRpcSigner } from '@ethersproject/providers'

type WakuPollingProps = {
  appName: string
  signer: JsonRpcSigner | undefined
}

function WakuPolling({ appName, signer }: WakuPollingProps) {
  const [wakuVoting, setWakuVoting] = useState<WakuVoting | undefined>(undefined)
  const [showPollCreation, setShowPollCreation] = useState(false)

  useEffect(() => {
    WakuVoting.create(appName, '0x01').then((e) => setWakuVoting(e))
  }, [])

  return (
    <Wrapper onClick={() => showPollCreation && setShowPollCreation(false)}>
      {showPollCreation && signer && (
        <PollCreation signer={signer} wakuVoting={wakuVoting} setShowPollCreation={setShowPollCreation} />
      )}
      <CreatePollButton disabled={!signer} onClick={() => setShowPollCreation(true)}>
        Create a poll
      </CreatePollButton>
      <PollList wakuVoting={wakuVoting} signer={signer} />
    </Wrapper>
  )
}

const CreatePollButton = styled(Button)`
  width: 343px;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 44px;
  margin-top: 49px;
  background-color: #ffb571;
  color: #ffffff;

  &:hover {
    border: 1px solid #a53607;
  }
`

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  overflow: auto;
  height: 100%;
`

export default WakuPolling

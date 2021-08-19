import React, { useState, useEffect } from 'react'
import WakuVoting from '@status-waku-voting/core'
import { providers } from 'ethers'
import { PollList } from './PollList'
import styled from 'styled-components'
import { PollCreation } from './PollCreation'

const provider = new providers.Web3Provider((window as any).ethereum)

type WakuPollingProps = {
  appName: string
}

function WakuPolling({ appName }: WakuPollingProps) {
  const [signer, setSigner] = useState(provider.getSigner())
  const [wakuVoting, setWakuVoting] = useState<WakuVoting | undefined>(undefined)
  const [showPollCreation, setShowPollCreation] = useState(false)

  useEffect(() => {
    ;(window as any).ethereum.on('accountsChanged', async () => {
      provider.send('eth_requestAccounts', [])
      setSigner(provider.getSigner())
    })
    WakuVoting.create(appName, '0x01').then((e) => setWakuVoting(e))
    provider.send('eth_requestAccounts', [])
  }, [])

  return (
    <Wrapper onClick={() => showPollCreation && setShowPollCreation(false)}>
      {showPollCreation && (
        <PollCreation signer={signer} wakuVoting={wakuVoting} setShowPollCreation={setShowPollCreation} />
      )}
      <button onClick={() => setShowPollCreation(true)}>New Poll</button>
      <PollList wakuVoting={wakuVoting} signer={signer} />
    </Wrapper>
  )
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  overflow: auto;
  min-height: 500px;
`

export default WakuPolling

import WakuVoting from '@status-waku-voting/core'
import { DetailedTimedPoll } from '@status-waku-voting/core/dist/esm/src/models/DetailedTimedPoll'
import { Wallet } from 'ethers'
import React, { useEffect, useState } from 'react'
import { Poll } from './Poll'
import { JsonRpcSigner } from '@ethersproject/providers'
import styled from 'styled-components'

type PollListProps = {
  wakuVoting: WakuVoting | undefined
  signer: Wallet | JsonRpcSigner
}

export function PollList({ wakuVoting, signer }: PollListProps) {
  const [polls, setPolls] = useState<DetailedTimedPoll[]>([])

  useEffect(() => {
    const interval = setInterval(async () => {
      if (wakuVoting) {
        setPolls(await wakuVoting.getDetailedTimedPolls())
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [wakuVoting])

  return (
    <PollListWrapper>
      {polls.map((poll) => {
        return <Poll key={poll.poll.id} poll={poll} wakuVoting={wakuVoting} signer={signer} />
      })}
    </PollListWrapper>
  )
}
const PollListWrapper = styled.div`
  display: flex;
  flex-direction: column;
`

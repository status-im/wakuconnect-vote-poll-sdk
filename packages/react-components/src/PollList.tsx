import WakuVoting from '@status-waku-voting/core'
import { DetailedTimedPoll } from '@status-waku-voting/core/dist/esm/src/models/DetailedTimedPoll'
import { Wallet } from 'ethers'
import React, { useEffect, useState } from 'react'
import { Poll } from './Poll'
import { JsonRpcSigner } from '@ethersproject/providers'

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
    <ul>
      {polls.map((poll) => {
        return (
          <li key={poll.poll.id}>
            <Poll poll={poll} wakuVoting={wakuVoting} signer={signer} />
          </li>
        )
      })}
    </ul>
  )
}

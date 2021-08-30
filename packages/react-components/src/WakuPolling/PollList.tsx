import WakuVoting from '@status-waku-voting/core'
import { DetailedTimedPoll } from '@status-waku-voting/core/dist/esm/src/models/DetailedTimedPoll'
import { Wallet } from 'ethers'
import React, { useEffect, useState } from 'react'
import { Poll } from './Poll'
import { JsonRpcSigner } from '@ethersproject/providers'
import styled from 'styled-components'

type PollListProps = {
  wakuVoting: WakuVoting | undefined
  signer: Wallet | JsonRpcSigner | undefined
}

export function PollList({ wakuVoting, signer }: PollListProps) {
  const [polls, setPolls] = useState<DetailedTimedPoll[]>([])
  const [dividedPolls, setDividedPolls] = useState<DetailedTimedPoll[][]>([[], [], []])
  useEffect(() => {
    const interval = setInterval(async () => {
      if (wakuVoting) {
        const { DetailedTimedPolls, updated } = await wakuVoting.getDetailedTimedPolls()
        if (updated) {
          setPolls(DetailedTimedPolls)
        }
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [wakuVoting])

  useEffect(() => {
    let arrayNo = 0
    const newDividedPolls: DetailedTimedPoll[][] = [[], [], []]
    polls.forEach((poll) => {
      newDividedPolls[arrayNo].push(poll)
      arrayNo++
      if (arrayNo > 2) {
        arrayNo = 0
      }
    })
    setDividedPolls(newDividedPolls)
  }, [polls])

  return (
    <PollListWrapper>
      {dividedPolls.map((pollArray, idx) => {
        return (
          <ColumnWrapper key={idx}>
            {pollArray.map((poll) => {
              return <Poll key={poll.poll.id} poll={poll} wakuVoting={wakuVoting} signer={signer} />
            })}
          </ColumnWrapper>
        )
      })}
    </PollListWrapper>
  )
}
const PollListWrapper = styled.div`
  display: flex;
  width: 100%;
`

const ColumnWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-right: 25px;
`

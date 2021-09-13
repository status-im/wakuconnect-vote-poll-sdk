import { WakuPolling } from '@status-waku-voting/core'
import { DetailedTimedPoll } from '@status-waku-voting/core/dist/esm/src/models/DetailedTimedPoll'
import { Wallet } from 'ethers'
import React, { useEffect, useState } from 'react'
import { Poll } from './Poll'
import { JsonRpcSigner } from '@ethersproject/providers'
import styled from 'styled-components'
import { Theme } from '@status-waku-voting/react-components'

type PollListProps = {
  theme: Theme
  wakuPolling: WakuPolling | undefined
  signer: Wallet | JsonRpcSigner | undefined
}

export function PollList({ wakuPolling, signer, theme }: PollListProps) {
  const [polls, setPolls] = useState<DetailedTimedPoll[]>([])
  const [dividedPolls, setDividedPolls] = useState<DetailedTimedPoll[][]>([[], [], []])
  useEffect(() => {
    const interval = setInterval(async () => {
      if (wakuPolling) {
        const DetailedTimedPolls = await wakuPolling.getDetailedTimedPolls()
        setPolls(DetailedTimedPolls)
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [wakuPolling])

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
              return <Poll key={poll.poll.id} poll={poll} wakuPolling={wakuPolling} signer={signer} theme={theme} />
            })}
          </ColumnWrapper>
        )
      })}
    </PollListWrapper>
  )
}

const PollListWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  gap: 24px;
  align-items: flex-start;

  @media (max-width: 768px) {
    gap: 16px;
    justify-content: center;
  }
`

const ColumnWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;

  @media (max-width: 768px) {
    gap: 16px;
  }
`

import { WakuPolling } from '@dappconnect/vote-poll-sdk-core'
import { DetailedTimedPoll } from '@dappconnect/vote-poll-sdk-core/dist/esm/src/models/DetailedTimedPoll'
import React, { useEffect, useState } from 'react'
import { Poll } from './Poll'
import styled from 'styled-components'
import { Theme } from '@status-waku-voting/react-components'
import { usePollList } from '@status-waku-voting/polling-hooks'
type PollListProps = {
  theme: Theme
  wakuPolling: WakuPolling | undefined
  account: string | null | undefined
}

export function PollList({ wakuPolling, account, theme }: PollListProps) {
  const polls = usePollList(wakuPolling)

  const [dividedPolls, setDividedPolls] = useState<DetailedTimedPoll[][]>([[], [], []])
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
              return <Poll key={poll.poll.id} poll={poll} wakuPolling={wakuPolling} account={account} theme={theme} />
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

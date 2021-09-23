import React from 'react'
import styled from 'styled-components'
import { Theme } from '@status-waku-voting/react-components'
import { ProposalCard } from './ProposalCard'
import { WakuVoting } from '@status-waku-voting/core'

import { VotingRoom } from '@status-waku-voting/core/dist/esm/src/types/PollType'

type ProposalListProps = {
  theme: Theme
  wakuVoting: WakuVoting
  votes: number[]
  availableAmount: number
  account: string | null | undefined
  mobileOnClick?: (votingRoom: VotingRoom) => void
}
export function ProposalList({ theme, wakuVoting, votes, availableAmount, account, mobileOnClick }: ProposalListProps) {
  return (
    <List>
      {votes.map((votingRoom) => {
        return (
          <ProposalCard
            account={account}
            votingRoomId={votingRoom}
            theme={theme}
            key={votingRoom}
            availableAmount={availableAmount}
            wakuVoting={wakuVoting}
            mobileOnClick={mobileOnClick}
          />
        )
      })}
    </List>
  )
}

const List = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;

  @media (max-width: 425px) {
    padding-top: 118px;
  }

  @media (max-width: 375px) {
    padding-top: 142px;
  }
`

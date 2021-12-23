import React from 'react'
import styled from 'styled-components'
import { Theme } from '@waku/vote-poll-sdk-react-components'
import { VotingRoomCard } from './VotingRoomCard'
import { WakuVoting } from '@waku/vote-poll-sdk-core'

import { VotingRoom } from '@waku/vote-poll-sdk-core/dist/esm/src/types/PollType'

type VotingRoomListProps = {
  theme: Theme
  wakuVoting: WakuVoting
  votes: number[]
  availableAmount: number
  account: string | null | undefined
  mobileOnClick?: (votingRoom: VotingRoom) => void
}
export function VotingRoomList({
  theme,
  wakuVoting,
  votes,
  availableAmount,
  account,
  mobileOnClick,
}: VotingRoomListProps) {
  return (
    <List>
      {votes.map((votingRoom) => {
        return (
          <VotingRoomCard
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

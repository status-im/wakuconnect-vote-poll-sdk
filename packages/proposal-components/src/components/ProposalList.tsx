import React from 'react'
import styled from 'styled-components'
import { Theme } from '@status-waku-voting/react-components'
import { ProposalCard } from './ProposalCard'
import { WakuVoting } from '@status-waku-voting/core'
import { VotingEmpty } from './VotingEmpty'
import { VotingRoom } from '@status-waku-voting/core/dist/esm/src/types/PollType'

type ProposalListProps = {
  theme: Theme
  wakuVoting: WakuVoting
  votes: VotingRoom[]
}
export function ProposalList({ theme, wakuVoting, votes }: ProposalListProps) {
  return (
    <List>
      {votes.map((vote) => {
        return (
          <ProposalCard
            heading={vote.question}
            text={vote.description}
            address={'#'}
            theme={theme}
            key={vote.id}
            id={vote.id}
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
`

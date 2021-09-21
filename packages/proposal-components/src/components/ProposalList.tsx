import React, { useRef } from 'react'
import styled from 'styled-components'
import { Theme, useMobileVersion } from '@status-waku-voting/react-components'
import { ProposalCard } from './ProposalCard'
import { WakuVoting } from '@status-waku-voting/core'
import { VotingEmpty } from './VotingEmpty'
import { VotingRoom } from '@status-waku-voting/core/dist/esm/src/types/PollType'

type ProposalListProps = {
  theme: Theme
  wakuVoting: WakuVoting
  votes: number[]
  availableAmount: number
  account: string | null | undefined
}
export function ProposalList({ theme, wakuVoting, votes, availableAmount, account }: ProposalListProps) {
  const ref = useRef<HTMLHeadingElement>(null)
  const mobileVersion = useMobileVersion(ref, 600)
  return (
    <List ref={ref}>
      {votes.map((votingRoom) => {
        return (
          <ProposalCard
            account={account}
            votingRoomId={votingRoom}
            theme={theme}
            key={votingRoom}
            mobileVersion={mobileVersion}
            availableAmount={availableAmount}
            wakuVoting={wakuVoting}
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

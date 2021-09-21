import React from 'react'
import { useHistory } from 'react-router'
import styled from 'styled-components'
import { Theme } from '@status-waku-voting/react-components'
import { ProposalInfo } from './ProposalInfo'
import { ProposalVote } from './ProposalVoteCard/ProposalVote'
import { VotingRoom } from '@status-waku-voting/core/dist/esm/src/types/PollType'
import { WakuVoting } from '@status-waku-voting/core'

interface ProposalCardProps {
  votingRoom: VotingRoom
  mobileVersion?: boolean
  theme: Theme
  hideModalFunction?: (val: boolean) => void
  availableAmount: number
  wakuVoting: WakuVoting
  account: string | null | undefined
}

export function ProposalCard({
  account,
  theme,
  votingRoom,
  mobileVersion,
  availableAmount,
  wakuVoting,
}: ProposalCardProps) {
  const history = useHistory()

  return (
    <Card onClick={() => mobileVersion && history.push(`/votingRoom/${votingRoom.id.toString()}`)}>
      <ProposalInfo votingRoom={votingRoom} providerName={wakuVoting.providerName} />
      <ProposalVote
        votingRoom={votingRoom}
        theme={theme}
        availableAmount={availableAmount}
        wakuVoting={wakuVoting}
        account={account}
      />
    </Card>
  )
}

export const Card = styled.div`
  display: flex;
  align-items: stretch;
  margin-bottom: 24px;

  @media (max-width: 768px) {
    flex-direction: column;
    box-shadow: 0px 1px 6px rgba(0, 0, 0, 0.15);
  }

  @media (max-width: 600px) {
    padding-bottom: 24px;
    box-shadow: none;
    border-bottom: 1px solid rgba(0, 0, 0, 0.3);
  }

  &:not:first-child {
    @media (max-width: 768px) {
      border-top: 1px solid #e0e0e0;
    }
  }
`

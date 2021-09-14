import React from 'react'
import { useHistory } from 'react-router'
import styled from 'styled-components'
import { Theme } from '@status-waku-voting/react-components'
import { ProposalInfo } from './ProposalInfo'
import { ProposalVote } from './ProposalVoteCard/ProposalVote'

interface ProposalCardProps {
  id: number
  theme: Theme
  heading: string
  text: string
  address: string
  vote?: number
  voteWinner?: number
  hideModalFunction?: (val: boolean) => void
}

export function ProposalCard({ id, heading, text, address, vote, voteWinner, theme }: ProposalCardProps) {
  const history = useHistory()

  return (
    <Card onClick={() => history.push(`/votingRoom/${id.toString}`)}>
      <ProposalInfo heading={heading} text={text} address={address} />
      <ProposalVote vote={vote} voteWinner={voteWinner} address={address} heading={heading} theme={theme} />
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

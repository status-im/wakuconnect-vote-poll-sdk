import React from 'react'
import styled from 'styled-components'
import { ProposalInfo } from './ProposalInfo'
import { ProposalVote } from './ProposalVoteCard/ProposalVote'

interface ProposalCardProps {
  heading: string
  text: string
  address: string
  vote?: number
  voteWinner?: number
  hideModalFunction?: (val: boolean) => void
}

export function ProposalCard({ heading, text, address, vote, voteWinner }: ProposalCardProps) {
  return (
    <Card>
      <ProposalInfo heading={heading} text={text} address={address} />
      <ProposalVote vote={vote} voteWinner={voteWinner} address={address} />
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

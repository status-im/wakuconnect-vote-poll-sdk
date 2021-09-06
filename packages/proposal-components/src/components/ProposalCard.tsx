import React from 'react'
import styled from 'styled-components'
import { ProposalInfo } from './ProposalInfo'
import { ProposalVote } from './ProposalVoteCard/ProposalVote'

export function ProposalCard() {
  return (
    <Card>
      <ProposalInfo
        heading={'This is a very long, explainative and sophisticated title for a proposal.'}
        text={
          'This is a longer description of the proposal. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque interdum rutrum sodales. Nullam mattis fermentum libero, non volutpat. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque interdum rutrum sodales. Nullam mattis fermentum libero. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque interdum rutrum sodales. Nullam mattis fermentum libero.'
        }
        address={'#'}
      />
      <ProposalVote vote={2345678} voteWinner={2} />
    </Card>
  )
}

export const Card = styled.div`
  display: flex;
  align-items: stretch;
  margin-top: 24px;

  @media (max-width: 768px) {
    flex-direction: column;
    margin-top: 0;
    padding: 16px 0 32px;
    border-bottom: 1px solid #e0e0e0;
  }
  @media (max-width: 600px) {
    padding-bottom: 16px;
  }
  &:not:first-child {
    @media (max-width: 768px) {
      border-top: 1px solid #e0e0e0;
    }
  }
`

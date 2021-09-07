import React from 'react'
import styled from 'styled-components'
import { ProposalCard } from './ProposalCard'

export function ProposalList() {
  return (
    <List>
      <ProposalCard
        heading={'This is a very long, explainative and sophisticated title for a proposal.'}
        text={
          'This is a longer description of the proposal. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque interdum rutrum sodales. Nullam mattis fermentum libero, non volutpat. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque interdum rutrum sodales. Nullam mattis fermentum libero. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque interdum rutrum sodales. Nullam mattis fermentum libero.'
        }
        address={'#'}
        vote={2345678}
        voteWinner={2}
      />
      <ProposalCard
        heading={'Short proposal title'}
        text={
          'This is a shorter description of the proposal. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque interdum rutrum sodales.'
        }
        address={'#'}
      />
    </List>
  )
}

const List = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 425px) {
    padding-top: 118px;
  }
`

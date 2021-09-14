import React from 'react'
import styled from 'styled-components'
import { Theme } from '@status-waku-voting/react-components'
import { ProposalCard } from './ProposalCard'
import { WakuVoting } from '@status-waku-voting/core'

type ProposalListProps = {
  theme: Theme
  wakuVoting: WakuVoting
  votes: any[]
}
export function ProposalList({ theme, wakuVoting, votes }: ProposalListProps) {
  return (
    <List>
      {votes.map((vote, idx) => {
        return <ProposalCard heading={vote[2]} text={vote[3]} address={'#'} theme={theme} key={idx} id={idx} />
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

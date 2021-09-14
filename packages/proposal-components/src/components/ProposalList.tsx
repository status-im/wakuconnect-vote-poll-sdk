import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Theme } from '@status-waku-voting/react-components'
import { ProposalCard } from './ProposalCard'
import { WakuVoting } from '@status-waku-voting/core'
import { VotingEmpty } from './VotingEmpty'

type ProposalListProps = {
  theme: Theme
  wakuVoting: WakuVoting
}
export function ProposalList({ theme, wakuVoting }: ProposalListProps) {
  const [votes, setVotes] = useState<any[]>([])

  useEffect(() => {
    const interval = setInterval(async () => {
      setVotes(await wakuVoting.getVotes())
    }, 10000)
    return () => clearInterval(interval)
  }, [])

  return (
    <List>
      {votes.map((vote, idx) => {
        return <ProposalCard heading={vote[2]} text={vote[3]} address={'#'} theme={theme} key={idx} />
      })}
      {votes && votes?.length === 0 && <VotingEmpty wakuVoting={wakuVoting} theme={theme} />}
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

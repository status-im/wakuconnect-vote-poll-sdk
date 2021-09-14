import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { ProposalHeader } from './ProposalHeader'
import { blueTheme } from '@status-waku-voting/react-components/dist/esm/src/style/themes'
import { ProposalList } from './ProposalList'
import { NotificationItem } from './NotificationItem'
import { WakuVoting } from '@status-waku-voting/core'
import { VotingEmpty } from './VotingEmpty'
import { VotingRoom } from '@status-waku-voting/core/dist/esm/src/types/PollType'

type ProposalProps = {
  wakuVoting: WakuVoting
}

export function Proposal({ wakuVoting }: ProposalProps) {
  const [votes, setVotes] = useState<VotingRoom[]>([])

  useEffect(() => {
    const interval = setInterval(async () => {
      setVotes(await wakuVoting.getVotingRooms())
    }, 10000)
    return () => clearInterval(interval)
  }, [])

  return (
    <ProposalWrapper>
      {votes && votes?.length === 0 ? (
        <VotingEmpty wakuVoting={wakuVoting} theme={blueTheme} />
      ) : (
        <ProposalVotesWrapper>
          <ProposalHeader theme={blueTheme} wakuVoting={wakuVoting} />
          <ProposalList theme={blueTheme} wakuVoting={wakuVoting} votes={votes} />
        </ProposalVotesWrapper>
      )}

      <NotificationItem text={'Proposal you finalized will be settled after 10 confirmations.'} address={'#'} />
    </ProposalWrapper>
  )
}

const ProposalWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 1000px;
  margin: 0 auto;
  padding: 150px 32px 50px;
  width: 100%;
  min-height: 100vh;
`
export const ProposalVotesWrapper = styled(ProposalWrapper)`
  width: 100%;
  padding: 0;
`

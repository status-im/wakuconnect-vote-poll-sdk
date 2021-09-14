import React, { useEffect, useState } from 'react'
import { blueTheme } from '@status-waku-voting/react-components/dist/esm/src/style/themes'
import { ProposalList } from '../ProposalList'
import { VotingEmpty } from '../VotingEmpty'
import { NotificationItem } from '../NotificationItem'
import { ProposalHeaderMobile } from './ProposalHeaderMobile'
import styled from 'styled-components'
import { WakuVoting } from '@status-waku-voting/core'
import { ProposalVotesWrapper } from '../Proposal'

type ProposalMainMobileProps = {
  wakuVoting: WakuVoting
}

export function ProposalMainMobile({ wakuVoting }: ProposalMainMobileProps) {
  const [votes, setVotes] = useState<any[]>([])

  useEffect(() => {
    const interval = setInterval(async () => {
      setVotes(await wakuVoting.getVotes())
    }, 10000)
    return () => clearInterval(interval)
  }, [])

  return (
    <ProposalWrapper>
      {votes && votes?.length === 0 ? (
        <VotingEmpty wakuVoting={wakuVoting} theme={blueTheme} />
      ) : (
        <ProposalVotesWrapper>
          <ProposalHeaderMobile theme={blueTheme} />
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
  width: 100%;
  min-height: 100vh;
  padding: 132px 16px 32px;

  @media (max-width: 425px) {
    padding: 64px 16px 84px;
  }
`
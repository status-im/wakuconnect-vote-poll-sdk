import React from 'react'
import { blueTheme } from '@status-waku-voting/react-components/dist/esm/src/style/themes'
import { ProposalList } from '../ProposalList'
import { VotingEmpty } from '../VotingEmpty'
import { NotificationItem } from '../NotificationItem'
import { ProposalHeaderMobile } from './ProposalHeaderMobile'
import styled from 'styled-components'
import { WakuVoting } from '@status-waku-voting/core'

type ProposalMainMobileProps = {
  wakuVoting: WakuVoting
}

export function ProposalMainMobile({ wakuVoting }: ProposalMainMobileProps) {
  return (
    <ProposalWrapper>
      <ProposalHeaderMobile theme={blueTheme} />
      <ProposalList theme={blueTheme} wakuVoting={wakuVoting} />
      {/* <VotingEmpty theme={blueTheme} /> */}
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

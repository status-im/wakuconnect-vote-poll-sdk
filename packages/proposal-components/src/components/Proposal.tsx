import React from 'react'
import styled from 'styled-components'
import { ProposalHeader } from './ProposalHeader'
import { blueTheme } from '@status-waku-voting/react-components/dist/esm/src/style/themes'
import { ProposalList } from './ProposalList'
import { VotingEmpty } from './VotingEmpty'

export function Proposal() {
  return (
    <ProposalWrapper>
      <VotingEmpty theme={blueTheme} />
      <ProposalHeader theme={blueTheme} />
      <ProposalList theme={blueTheme} />
    </ProposalWrapper>
  )
}

const ProposalWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 1000px;
  // position: relative;
  margin: 0 auto;
  padding: 150px 32px 50px;
  width: 100%;

  @media (max-width: 600px) {
    padding: 132px 16px 32px;
  }

  @media (max-width: 425px) {
    padding: 64px 16px 84px;
  }
`

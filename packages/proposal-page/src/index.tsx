import React from 'react'
import { useTest } from '@status-waku-voting/proposal-hooks'
import { Proposal } from '@status-waku-voting/proposal-components'
import { TopBar, GlobalStyle } from '@status-waku-voting/react-components'
import votingIcon from './assets/images/voting.svg'
import styled from 'styled-components'

export function ProposalPage() {
  useTest()
  return (
    <Wrapper>
      <GlobalStyle />
      <TopBar logo={votingIcon} title={'Proposals Dapp'} theme={'blue'} />
      <Proposal />
    </Wrapper>
  )
}

const Wrapper = styled.div`
  height: 100%;
  width: 100%;
`

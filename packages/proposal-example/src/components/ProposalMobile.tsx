import React from 'react'
import { Redirect, Route, Switch } from 'react-router'
import { BrowserRouter } from 'react-router-dom'
import styled from 'styled-components'
import { ProposalVoteMobile, ProposeMobile } from '@status-waku-voting/proposal-components'
import { Proposal } from './Proposal'
import { WakuVoting } from '@status-waku-voting/core'
import { useTokenBalance } from '@status-waku-voting/react-components'

type ProposalMobileProps = {
  wakuVoting: WakuVoting
  account: string | null | undefined
}

export function ProposalMobile({ wakuVoting, account }: ProposalMobileProps) {
  const tokenBalance = useTokenBalance(account, wakuVoting)
  return (
    <BrowserRouter>
      <ProposalWrapper>
        <Switch>
          <Route exact path="/votingRoom/:id">
            <ProposalVoteMobile wakuVoting={wakuVoting} availableAmount={tokenBalance} account={account} />
          </Route>
          <Route exact path="/creation">
            <ProposeMobile availableAmount={tokenBalance} wakuVoting={wakuVoting} />
          </Route>
          <Route exact path="/proposal">
            <Proposal wakuVoting={wakuVoting} account={account} />
          </Route>
        </Switch>
      </ProposalWrapper>
    </BrowserRouter>
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
`

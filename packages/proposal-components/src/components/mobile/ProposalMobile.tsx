import React from 'react'
import { Redirect, Route, Switch } from 'react-router'
import { BrowserRouter } from 'react-router-dom'
import styled from 'styled-components'
import { ProposalVoteMobile } from './ProposalVoteMobile'
import { ProposeMobile } from './ProposeMobile'
import { ProposalMainMobile } from './ProposalMainMobile'
import { WakuVoting } from '@status-waku-voting/core'

type ProposalMobileProps = {
  wakuVoting: WakuVoting
}

export function ProposalMobile({ wakuVoting }: ProposalMobileProps) {
  return (
    <BrowserRouter>
      <ProposalWrapper>
        <Switch>
          <Route exact path="/" render={() => <Redirect to="/proposal" />} />
          <Route exact path="/votingRoom/:id">
            <ProposalVoteMobile wakuVoting={wakuVoting} availableAmount={123} />
          </Route>
          <Route exact path="/creation" component={ProposeMobile} />
          <Route exact path="/proposal">
            <ProposalMainMobile wakuVoting={wakuVoting} />
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

import React from 'react'
import { Route, Switch, useHistory } from 'react-router'
import { BrowserRouter } from 'react-router-dom'
import styled from 'styled-components'
import { VotingRoomMobile, NewVotingRoomMobile } from '@waku/vote-sdk-react-components'
import { Voting } from './Voting'
import { WakuVoting } from '@waku/vote-poll-sdk-core'
import { useTokenBalance } from '@waku/vote-poll-sdk-react-components'

type VotingRoomCreationProps = {
  tokenBalance: number
  wakuVoting: WakuVoting
}

function VotingRoomCreation({ tokenBalance, wakuVoting }: VotingRoomCreationProps) {
  const history = useHistory()
  return (
    <NewVotingRoomMobile
      availableAmount={tokenBalance}
      wakuVoting={wakuVoting}
      callbackAfterVote={() => history.push('/proposal')}
    />
  )
}

type VotingMobileProps = {
  wakuVoting: WakuVoting
  account: string | null | undefined
}

export function VotingMobile({ wakuVoting, account }: VotingMobileProps) {
  const tokenBalance = useTokenBalance(account, wakuVoting)
  return (
    <BrowserRouter>
      <Wrapper>
        <Switch>
          <Route exact path="/votingRoom/:id">
            <VotingRoomMobile wakuVoting={wakuVoting} availableAmount={tokenBalance} account={account} />
          </Route>
          <Route exact path="/creation">
            <VotingRoomCreation tokenBalance={tokenBalance} wakuVoting={wakuVoting} />
          </Route>
          <Route exact path="/voting">
            <Voting wakuVoting={wakuVoting} account={account} />
          </Route>
        </Switch>
      </Wrapper>
    </BrowserRouter>
  )
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 1000px;
  margin: 0 auto;
  width: 100%;
  min-height: 100vh;
`

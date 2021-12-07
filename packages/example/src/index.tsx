import React from 'react'
import ReactDOM from 'react-dom'
import { PollingPage } from '@dappconnect/poll-sdk-example'
import { VotingPage } from '@dappconnect/vote-sdk-example'
import { BrowserRouter } from 'react-router-dom'
import { Route, Switch } from 'react-router'

ReactDOM.render(
  <div style={{ height: '100%' }}>
    <BrowserRouter>
      <Switch>
        <Route exact path="/polling" component={PollingPage} />
        <Route exact path="/voting" component={VotingPage} />
      </Switch>
    </BrowserRouter>
  </div>,
  document.getElementById('root')
)

import React from 'react'
import ReactDOM from 'react-dom'
import { PollingPage } from '@status-waku-voting/polling-example'
import { ProposalPage } from '@status-waku-voting/proposal-example'
import { BrowserRouter } from 'react-router-dom'
import { Route, Switch } from 'react-router'

ReactDOM.render(
  <div style={{ height: '100%' }}>
    <BrowserRouter>
      <Switch>
        <Route exact path="/polling" component={PollingPage} />
        <Route exact path="/proposal" component={ProposalPage} />
      </Switch>
    </BrowserRouter>
  </div>,
  document.getElementById('root')
)

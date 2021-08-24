import React from 'react'
import ReactDOM from 'react-dom'

import styled, { createGlobalStyle } from 'styled-components'
import { Polling } from './pages/Poling'
import { BrowserRouter } from 'react-router-dom'
import { Redirect, Route, Switch } from 'react-router'

export const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
     }

  body, html, #root {
    margin: 0;
    width: 100%;
    height: 100%;
  }
`

const Page = styled.div`
  height: 100%;
`

ReactDOM.render(
  <Page>
    <GlobalStyle />
    <BrowserRouter>
      <Switch>
        <Route exact path="/" render={() => <Redirect to="/polling" />} />
        <Route exact path="/polling" component={Polling} />
      </Switch>
    </BrowserRouter>
  </Page>,
  document.getElementById('root')
)

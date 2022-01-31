import React from 'react'
import styled from 'styled-components'
import { GlobalStyle, TopBar } from '@waku/vote-poll-sdk-react-components'
import { blueTheme } from '@waku/vote-poll-sdk-react-components/dist/esm/src/style/themes'
import ReactDOM from 'react-dom'
import { useWeb3Connect } from './hooks/useWeb3Connect'
import { Voting } from './components/Voting'
import { useWakuVoting } from '@waku/vote-sdk-react-hooks'

const VOTING_ADDRESS = '0xCA4093D66280Ec1242b660088188b50fDC14dcC4'
const MULTICALL_ADDRESS = '0x53c43764255c17bd724f74c4ef150724ac50a3ed'
const SUPPORTED_CHAIN_ID = 3

export function MainPage() {
  const { activate, deactivate, account, provider } = useWeb3Connect(SUPPORTED_CHAIN_ID)
  const wakuVoting = useWakuVoting(
    'test',
    VOTING_ADDRESS,
    provider,
    MULTICALL_ADDRESS
  )

  return (
    <Wrapper>
      <TopBar
        logo={''}
        logoWidth={84}
        title={'WakuConnect Vote Demo'}
        theme={blueTheme}
        activate={activate}
        account={account}
        deactivate={deactivate}
      />
      {wakuVoting &&
        <Voting
          wakuVoting={wakuVoting}
          account={account}
          activate={activate}
        />}
    </Wrapper>
  )
}

export function App() {
  return (
    <Wrapper>
      <GlobalStyle />
      <MainPage />
    </Wrapper>
  )
}

const Wrapper = styled.div`
  height: 100%;
  width: 100%;
`

ReactDOM.render(
  <div style={{ height: '100%' }}>
    <App />
  </div>,
  document.getElementById('root')
)
import React from 'react'
import { WakuPolling } from '@status-waku-voting/react-components'
import styled from 'styled-components'
import { TopBar } from '../components/TopBar'
import pollingIcon from '../assets/images/pollingIcon.svg'
export function Polling() {
  return (
    <Wrapper>
      <TopBar logo={pollingIcon} title={'Polling Dapp'} />
      <WakuPolling appName={'testApp_'} />
    </Wrapper>
  )
}

const Wrapper = styled.div`
  height: 100%;
  width: 100%;
`

import React from 'react'
import styled from 'styled-components'
import dapp from '../assets/svg/dapp.svg'
import status from '../assets/svg/status.svg'
import metamask from '../assets/svg/metamask.svg'

export function Networks() {
  return (
    <NetworksWrapper>
      <Network href="https://ethereum.org/en/dapps/" style={{ backgroundImage: `url(${dapp})` }} />
      <Network href="https://status.im/get/" style={{ backgroundImage: `url(${status})` }} />
      <Network href="https://metamask.io/" style={{ backgroundImage: `url(${metamask})` }} />
    </NetworksWrapper>
  )
}

const NetworksWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`

const Network = styled.a`
  width: 176px;
  height: 64px;
  margin-top: 32px;
  border: none;
  background-repeat: no-repeat;
  background-position: center;
  background-color: transparent;
`

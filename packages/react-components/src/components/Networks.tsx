import React from 'react'
import styled from 'styled-components'
import dapp from '../assets/svg/dapp.svg'
import status from '../assets/svg/status.svg'
import metamask from '../assets/metamask.png'

export function Networks() {
  return (
    <NetworksWrapper>
      <Network href="https://ethereum.org/en/dapps/">
        <NetworkLogo src={dapp} alt="DApp logo" />
      </Network>
      <Network href="https://status.im/get/">
        {' '}
        <NetworkLogo src={status} alt="DApp logo" />
      </Network>
      <Network href="https://metamask.io/">
        {' '}
        <NetworkLogoMeta src={metamask} alt="DApp logo" />
        MetaMask
      </Network>
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
  display: flex;
  align-items: center;
  justify-content: center;
  width: 176px;
  height: 64px;
  margin-top: 32px;
  border: none;
  font-weight: bold;
  font-size: 17px;
  line-height: 24px;
  text-decoration: none;
  color: #000000;
`
const NetworkLogo = styled.img`
  width: auto;
`

const NetworkLogoMeta = styled(NetworkLogo)`
  width: 64px;
  height: 64px;
  margin-right: 16px;
`

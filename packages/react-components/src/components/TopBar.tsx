import React, { useState } from 'react'
import styled from 'styled-components'
import { useEthers, shortenAddress } from '@usedapp/core'
import metamaskIcon from '../assets/svg/metamask.svg'
import statusIcon from '../assets/svg/status.svg'
import dappIcon from '../assets/svg/dapp.svg'
import { Modal } from './Modal'
import { ConnectButton, Account, ButtonDisconnect } from './misc/Buttons'

type TopBarProps = {
  logo: string
  title: string
  theme: string
}

export function TopBar({ logo, title, theme }: TopBarProps) {
  const { activateBrowserWallet, deactivate, account } = useEthers()
  const [isOpened, setIsOpened] = useState(false)
  const [selectConnect, setSelectConnect] = useState(false)

  return (
    <Wrapper>
      <ContentWrapper>
        <Logo style={{ backgroundImage: `url(${logo})` }} />
        <TitleWrapper>
          {title.split(' ').map((text, idx) => (
            <div key={idx}>{text}</div>
          ))}
        </TitleWrapper>
        {account ? (
          <AccountWrap>
            <Account
              theme={theme}
              onClick={(e) => {
                e.stopPropagation()
                setIsOpened(!isOpened)
              }}
            >
              <GreenDot />
              <>{shortenAddress(account)}</>
            </Account>
            <ButtonDisconnect className={isOpened ? 'opened' : undefined} onClick={() => deactivate()}>
              Disconnect
            </ButtonDisconnect>
          </AccountWrap>
        ) : (
          <ConnectButton
            theme={theme}
            onClick={() => {
              if ((window as any).ethereum) {
                activateBrowserWallet()
              } else setSelectConnect(true)
            }}
          >
            Connect
          </ConnectButton>
        )}
      </ContentWrapper>

      {selectConnect && (
        <Modal heading="Connect" setShowModal={setSelectConnect}>
          <Networks>
            <Network href="https://ethereum.org/en/dapps/" style={{ backgroundImage: `url(${dappIcon})` }} />
            <Network href="https://status.im/get/" style={{ backgroundImage: `url(${statusIcon})` }} />
            <Network href="https://metamask.io/" style={{ backgroundImage: `url(${metamaskIcon})` }} />
          </Networks>
        </Modal>
      )}
    </Wrapper>
  )
}

const GreenDot = styled.div`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #4ebc60;
  margin-right: 5px;
`
const AccountWrap = styled.div`
  position: relative;
`

const TitleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin: auto;
  margin-left: 8px;
  font-family: Inter;
  font-style: italic;
  font-weight: 600;
  font-size: 20px;
  line-height: 17px;
`

const Logo = styled.div`
  height: 30px;
  width: 32px;
`

const Wrapper = styled.div`
  display: flex;
  height: 96px;
  width: 100%;
  position: fixed;
  background: #fbfcfe;
  z-index: 10;

  @media (max-width: 600px) {
    height: 64px;
  }
`
const ContentWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 32px 40px;
  max-width: 1440px;
  margin: 0 auto;
  width: 100%;

  @media (max-width: 600px) {
    padding: 16px;
    padding-left: 24px;
  }
`
const Networks = styled.div`
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

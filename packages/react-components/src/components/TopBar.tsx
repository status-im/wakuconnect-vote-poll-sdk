import React, { useState } from 'react'
import styled from 'styled-components'
import { shortenAddress } from '@usedapp/core'
import { Modal } from './Modal'
import { ConnectButton, Account, ButtonDisconnect } from './misc/Buttons'
import { Networks } from './Networks'
import { Theme } from '../style/themes'

type TopBarProps = {
  logo: string
  title: string
  theme: Theme
  activate: () => void
  deactivate: () => void
  account: string | undefined | null
}

export function TopBar({ logo, title, theme, activate, deactivate, account }: TopBarProps) {
  const [isOpened, setIsOpened] = useState(false)
  const [selectConnect, setSelectConnect] = useState(false)

  return (
    <Wrapper theme={theme}>
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
            <ButtonDisconnect theme={theme} className={isOpened ? 'opened' : undefined} onClick={() => deactivate()}>
              Disconnect
            </ButtonDisconnect>
          </AccountWrap>
        ) : (
          <ConnectButton
            theme={theme}
            onClick={() => {
              if ((window as any).ethereum) {
                activate()
              } else setSelectConnect(true)
            }}
          >
            Connect
          </ConnectButton>
        )}
      </ContentWrapper>

      {selectConnect && (
        <Modal heading="Connect" setShowModal={setSelectConnect}>
          <Networks />
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

interface WrapperProps {
  theme: Theme
}

const Wrapper = styled.div<WrapperProps>`
  display: flex;
  height: 96px;
  width: 100%;
  position: fixed;
  background: #fbfcfe;
  z-index: 10;

  @media (max-width: 600px) {
    height: 64px;
  }

  @media (max-width: 425px) {
    background-color: ${({ theme }) => theme.backgroundColor};
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

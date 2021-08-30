import React, { useState } from 'react'
import styled from 'styled-components'
import { useEthers, shortenAddress } from '@usedapp/core'
type TopBarProps = {
  logo: string
  title: string
}

export function TopBar({ logo, title }: TopBarProps) {
  const { activateBrowserWallet, deactivate, account } = useEthers()
  const [isOpened, setIsOpened] = useState(false)

  return (
    <Wrapper>
      <ContentWrapper>
        <Logo style={{ backgroundImage: `url(${logo})` }} />
        <TitleWrapper>
          {title.split(' ').map((text) => (
            <div>{text}</div>
          ))}
        </TitleWrapper>
        {account ? (
          <AccountWrap>
            <Account
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
          <Button onClick={() => activateBrowserWallet()}>Connect</Button>
        )}
      </ContentWrapper>
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

const Account = styled.button`
  display: flex;
  flex-direction: row;
  align-items: center;
  background: #ffffff;
  border: 1px solid #eef2f5;
  box-sizing: border-box;
  border-radius: 21px;
  padding: 11px 12px 11px 17px;
  font-weight: 500;
  font-size: 13px;
  line-height: 22px;

  &:hover {
    border: 1px solid #ffb571;
  }
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

const Button = styled.button`
  padding: 10px 28px;
  background-color: #ffb571;
  color: #ffffff;
  font-weight: bold;
  font-size: 15px;
  line-height: 24px;
  border-radius: 8px;
  border: 0px;
  outline: none;

  &:not(:disabled):hover {
    background: #a53607;
  }

  &:not(:disabled):active {
    background: #f4b77e;
  }

  &:disabled {
    background: #888888;
    filter: grayscale(1);
  }

  @media (max-width: 600px) {
    padding: 3px 28px;
  }
`

const ButtonDisconnect = styled.button`
  position: absolute;
  top: calc(100% + 4px);
  right: 0;
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  font-weight: 500;
  font-size: 15px;
  line-height: 22px;
  text-align: center;
  padding: 15px 32px;
  color: #a53607;
  background: #ffffff;
  border: 1px solid #eef2f5;
  border-radius: 16px 4px 16px 16px;
  box-shadow: 0px 2px 16px rgba(0, 9, 26, 0.12);
  transition: all 0.3s;
  outline: none;

  &:hover {
    background: #a53607;
    color: #ffffff;
  }

  &:active {
    background: #f4b77e;
    color: #ffffff;
  }

  &.opened {
    opacity: 1;
    visibility: visible;
    pointer-events: auto;
    z-index: 10;
  }
`

const Logo = styled.div`
  height: 30px;
  width: 32px;
`

const Wrapper = styled.div`
  height: 96px;
  background: #fbfcfe;
  display: flex;

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

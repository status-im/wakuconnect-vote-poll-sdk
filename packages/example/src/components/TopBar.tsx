import React from 'react'
import styled from 'styled-components'
import { useEthers, shortenAddress } from '@usedapp/core'
type TopBarProps = {
  logo: string
  title: string
}

export function TopBar({ logo, title }: TopBarProps) {
  const { activateBrowserWallet, account } = useEthers()

  return (
    <Wrapper>
      <Logo style={{ backgroundImage: `url(${logo})` }} />
      <TitleWrapper>
        {title.split(' ').map((text) => (
          <div>{text}</div>
        ))}
      </TitleWrapper>
      {account ? (
        <AccountDiv>
          <GreenDot />
          <>{shortenAddress(account)}</>
        </AccountDiv>
      ) : (
        <Button onClick={() => activateBrowserWallet()}>Connect</Button>
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

const AccountDiv = styled.div`
  width: 130px;
  height: 44px;
  background: #ffffff;
  border: 1px solid #eef2f5;
  box-sizing: border-box;
  border-radius: 21px;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0px 12px;
  margin: auto;
  margin-right: 40px;
  font-family: Inter;
  font-style: normal;
  font-weight: 500;
  font-size: 13px;
  line-height: 22px;
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
  border-radius: 8px;
  border: 0px;
  margin: auto;
  margin-right: 40px;
  height: 44px;
  width: 117px;
`

const Logo = styled.div`
  height: 30px;
  width: 32px;
  margin-left: 40px;
  margin-top: auto;
  margin-bottom: auto;
`

const Wrapper = styled.div`
  height: 96px;
  background: #fbfcfe;
  display: flex;
`

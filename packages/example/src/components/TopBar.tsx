import React from 'react'
import styled from 'styled-components'

type TopBarProps = {
  logo: string
  title: string
}

export function TopBar({ logo, title }: TopBarProps) {
  return (
    <Wrapper>
      <Logo style={{ backgroundImage: `url(${logo})` }} />
      <TitleWrapper>
        {title.split(' ').map((text) => (
          <div>{text}</div>
        ))}
      </TitleWrapper>
      <Button>Connect</Button>
    </Wrapper>
  )
}

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

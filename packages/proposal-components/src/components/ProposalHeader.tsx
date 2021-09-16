import React, { useState } from 'react'
import styled from 'styled-components'
import { useEthers } from '@usedapp/core'
import { Modal, Networks, CreateButton } from '@status-waku-voting/react-components'
import { Theme } from '@status-waku-voting/react-components/dist/esm/src/style/themes'

type ProposalHeaderProps = {
  theme: Theme
  account: string | null | undefined
  onCreateClick: () => void
  onConnectClick: () => void
}

export function ProposalHeader({ theme, account, onCreateClick, onConnectClick }: ProposalHeaderProps) {
  return (
    <Wrapper>
      <Header>
        <Heading>Your voice has real power</Heading>
        <HeaderText>
          Take part in a decentralised governance by voting on proposals provided by community or creating your own.
        </HeaderText>
      </Header>
      {account ? (
        <CreateButton theme={theme} onClick={onCreateClick}>
          Create proposal
        </CreateButton>
      ) : (
        <CreateButton theme={theme} onClick={onConnectClick}>
          Connect to vote
        </CreateButton>
      )}
    </Wrapper>
  )
}

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`
const Header = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  max-width: 680px;

  @media (max-width: 425px) {
    position: fixed;
    padding: 12px 16px 0;
    width: 100%;
    background: #f8faff;
    z-index: 10;
  }
`

const Heading = styled.h1`
  font-weight: bold;
  font-size: 28px;
  line-height: 38px;
  letter-spacing: -0.4px;
  margin: 0;
  margin-bottom: 8px;

  @media (max-width: 425px) {
    font-size: 22px;
    line-height: 30px;
  }
`

const HeaderText = styled.p`
  font-size: 22px;
  line-height: 32px;
  margin: 0;
  margin-bottom: 24px;

  @media (max-width: 425px) {
    font-size: 13px;
    line-height: 18px;
    margin-bottom: 16px;
  }
`

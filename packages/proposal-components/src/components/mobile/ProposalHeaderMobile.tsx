import React, { useState } from 'react'
import { useHistory } from 'react-router'
import styled from 'styled-components'
import { useEthers } from '@usedapp/core'
import { Modal, Networks, CreateButton } from '@status-waku-voting/react-components'
import { Theme } from '@status-waku-voting/react-components/dist/esm/src/style/themes'
import { Wrapper } from '../ProposalHeader'

type ProposalHeaderMobileProps = {
  theme: Theme
}

export function ProposalHeaderMobile({ theme }: ProposalHeaderMobileProps) {
  const { activateBrowserWallet, account } = useEthers()
  const [selectConnect, setSelectConnect] = useState(false)
  const history = useHistory()

  return (
    <Wrapper>
      <Header>
        <Heading>Your voice has real power</Heading>
        <HeaderText>
          Take part in a decentralised governance by voting on proposals provided by community or creating your own.
        </HeaderText>
      </Header>
      {account ? (
        <CreateButton theme={theme} onClick={() => history.push(`/creation`)}>
          Create proposal
        </CreateButton>
      ) : (
        <CreateButton
          theme={theme}
          onClick={() => {
            if ((window as any).ethereum) {
              activateBrowserWallet()
            } else setSelectConnect(true)
          }}
        >
          Connect to vote
        </CreateButton>
      )}
      {selectConnect && (
        <Modal heading="Connect" setShowModal={setSelectConnect} theme={theme}>
          <Networks />
        </Modal>
      )}
    </Wrapper>
  )
}

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

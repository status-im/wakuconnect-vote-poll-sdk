import React, { useEffect, useState, useRef } from 'react'
import { useHistory } from 'react-router'
import { useEthers } from '@usedapp/core'
import styled from 'styled-components'
import { CreateButton, Modal, Networks, Theme, useMobileVersion } from '@status-waku-voting/react-components'
import { WakuVoting } from '@status-waku-voting/core'
import { NewVoteModal } from './newVoteModal/NewVoteModal'

type VotingEmptyProps = {
  theme: Theme
  wakuVoting: WakuVoting
  availableAmount: number
}

export function VotingEmpty({ wakuVoting, theme, availableAmount }: VotingEmptyProps) {
  const { account, activateBrowserWallet } = useEthers()
  const [selectConnect, setSelectConnect] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const history = useHistory()

  const ref = useRef<HTMLHeadingElement>(null)
  const mobileVersion = useMobileVersion(ref, 600)

  return (
    <VotingEmptyWrap ref={ref}>
      <NewVoteModal
        theme={theme}
        availableAmount={availableAmount}
        setShowModal={setShowModal}
        showModal={showModal}
        wakuVoting={wakuVoting}
      />
      <EmptyWrap>
        <EmptyHeading>There are no proposals at the moment!</EmptyHeading>
        <EmptyText>
          Any worthwhile idea going on on your mind? Feel free to smash that button and see find out if the community
          likes it!
        </EmptyText>
      </EmptyWrap>
      {account ? (
        <EmptyCreateButton
          theme={theme}
          onClick={() => {
            mobileVersion ? history.push(`/creation`) : setShowModal(true)
          }}
        >
          Create proposal
        </EmptyCreateButton>
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
    </VotingEmptyWrap>
  )
}

const VotingEmptyWrap = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #fff;
  margin-top: 20vh;
  padding: 0 32px;

  @media (max-width: 600px) {
    height: 250px;
    top: 50vh;
    padding: 0 16px;
  }
`

const EmptyWrap = styled.div`
  width: 100%;
  max-width: 800px;
  display: flex;
  flex-direction: column;
  align-items: center;
`

const EmptyHeading = styled.h1`
  font-weight: bold;
  font-size: 28px;
  line-height: 38px;
  letter-spacing: -0.4px;
  margin-bottom: 8px;
  text-align: center;

  @media (max-width: 600px) {
    font-size: 17px;
    line-height: 24px;
    margin-bottom: 16px;
  }
`

const EmptyText = styled.p`
  font-size: 22px;
  text-align: center;
  line-height: 32px;
  margin: 0;
  margin-bottom: 24px;

  @media (max-width: 600px) {
    font-size: 15px;
    line-height: 22px;
    margin-bottom: 20px;
  }
`

const EmptyCreateButton = styled(CreateButton)`
  @media (max-width: 425px) {
    position: static;
  }
`

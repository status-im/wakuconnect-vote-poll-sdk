import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router'
import { useEthers } from '@usedapp/core'
import styled from 'styled-components'
import { CreateButton, Modal, Networks, Theme } from '@status-waku-voting/react-components'
import { ProposeModal } from './ProposeModal'
import { ProposeVoteModal } from './ProposeVoteModal'
import { WakuVoting } from '@status-waku-voting/core'

type VotingEmptyProps = {
  theme: Theme
  wakuVoting: WakuVoting
}

export function VotingEmpty({ wakuVoting, theme }: VotingEmptyProps) {
  const { account, activateBrowserWallet } = useEthers()
  const [selectConnect, setSelectConnect] = useState(false)
  const [showProposeModal, setShowProposeModal] = useState(false)
  const [showProposeVoteModal, setShowProposeVoteModal] = useState(false)
  const [mobileVersion, setMobileVersion] = useState(false)
  const [title, setTitle] = useState('')
  const [text, setText] = useState('')
  const history = useHistory()

  const setNext = (val: boolean) => {
    setShowProposeVoteModal(val)
    setShowProposeModal(false)
  }

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 600) {
        setMobileVersion(true)
      } else {
        setMobileVersion(false)
      }
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <VotingEmptyWrap>
      <EmptyWrap>
        <EmptyHeading>There are no proposals at the moment!</EmptyHeading>
        <EmptyText>
          Any worthwhile idea going on on your mind? Feel free to smash that button and see find out if the community
          likes it!
        </EmptyText>
      </EmptyWrap>
      {showProposeModal && (
        <Modal heading="Create proposal" theme={theme} setShowModal={setShowProposeModal}>
          <ProposeModal
            title={title}
            text={text}
            setText={setText}
            setTitle={setTitle}
            availableAmount={6524354}
            setShowProposeVoteModal={setNext}
          />
        </Modal>
      )}
      {showProposeVoteModal && (
        <Modal heading="Create proposal" theme={theme} setShowModal={setShowProposeVoteModal}>
          <ProposeVoteModal
            wakuVoting={wakuVoting}
            title={title}
            text={text}
            availableAmount={6524354}
            setShowModal={setShowProposeVoteModal}
            setText={setText}
            setTitle={setTitle}
          />
        </Modal>
      )}

      {account ? (
        <EmptyCreateButton
          theme={theme}
          onClick={() => {
            mobileVersion ? history.push(`/creation`) : setShowProposeModal(true)
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

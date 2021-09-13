import React, { useEffect, useState } from 'react'
import { useEthers } from '@usedapp/core'

import styled from 'styled-components'
import { CreateButton, Modal, Theme } from '@status-waku-voting/react-components'
import { ProposeModal } from './ProposeModal'
import { ProposeVoteModal } from './ProposeVoteModal'

type VotingEmptyProps = {
  theme: Theme
}

export function VotingEmpty({ theme }: VotingEmptyProps) {
  const { account, activateBrowserWallet } = useEthers()
  const [selectConnect, setSelectConnect] = useState(false)
  const [showProposeModal, setShowProposeModal] = useState(false)
  const [showProposeVoteModal, setShowProposeVoteModal] = useState(false)
  const [mobileVersion, setMobileVersion] = useState(false)
  const [title, setTitle] = useState('')
  const [text, setText] = useState('')

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
            availableAmount={6524}
            setShowProposeVoteModal={setNext}
          />
        </Modal>
      )}
      {showProposeVoteModal && (
        <Modal heading="Create proposal" theme={theme} setShowModal={setShowProposeVoteModal}>
          <ProposeVoteModal
            title={title}
            text={text}
            availableAmount={6524}
            setShowModal={setShowProposeVoteModal}
            setText={setText}
            setTitle={setTitle}
          />
        </Modal>
      )}

      {!mobileVersion && (
        <div>
          {account ? (
            <CreateButton theme={theme} onClick={() => setShowProposeModal(true)}>
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
        </div>
      )}
    </VotingEmptyWrap>
  )
}

const VotingEmptyWrap = styled.div`
  position: absolute;
  top: 96px;
  left: 50%;
  transform: translateX(-50%);
  padding: 0 32px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: calc(100vh - 96px);
  background: #fffff;
  z-index: 99;

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
    font-size: 22px;
    line-height: 22px;
    padding: 0 16px;
  }
  @media (max-width: 375px) {
    font-size: 20px;
  }
`

const EmptyText = styled.p`
  font-size: 22px;
  text-align: center;
  line-height: 32px;
  margin: 0;
  margin-bottom: 24px;

  @media (max-width: 600px) {
    font-size: 13px;
    line-height: 18px;
    margin: 0;
    padding: 0 16px;
  }

  @media (max-width: 340px) {
    font-size: 12px;
  }
`

import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useEthers } from '@usedapp/core'
import { FinalBtn, VoteBtnAgainst, VoteBtnFor } from '../Buttons'
import { VoteSubmitButton } from './VoteSubmitButton'
import { VoteChart } from './VoteChart'
import { ViewLink } from '../ViewLink'
import { Modal, Theme } from '@status-waku-voting/react-components'
import { VoteModal } from '../VoteModal'
import { VoteAnimatedModal } from '../VoteAnimatedModal'
import { VotingRoom } from '@status-waku-voting/core/dist/esm/src/types/PollType'
import { WakuVoting } from '@status-waku-voting/core'
import { useRoomWakuVotes } from '@status-waku-voting/proposal-hooks'

interface ProposalVoteProps {
  theme: Theme
  votingRoom: VotingRoom
  availableAmount: number
  hideModalFunction?: (val: boolean) => void
  wakuVoting: WakuVoting
}

export function ProposalVote({ votingRoom, theme, availableAmount, hideModalFunction, wakuVoting }: ProposalVoteProps) {
  const { account } = useEthers()
  const [showVoteModal, setShowVoteModal] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [proposingAmount, setProposingAmount] = useState(0)
  const [selectedVoted, setSelectedVoted] = useState(0)

  const setNext = (val: boolean) => {
    setShowConfirmModal(val)
    setShowVoteModal(false)
  }

  const hideConfirm = (val: boolean) => {
    if (hideModalFunction) {
      hideModalFunction(false)
    }
    setShowConfirmModal(val)
  }

  const { votes, sum, modifiedVotingRoom } = useRoomWakuVotes(votingRoom, wakuVoting)

  return (
    <Card>
      {showVoteModal && (
        <Modal heading={votingRoom.question} setShowModal={setShowVoteModal} theme={theme}>
          <VoteModal
            votingRoom={modifiedVotingRoom}
            availableAmount={availableAmount}
            selectedVote={selectedVoted}
            proposingAmount={proposingAmount}
            setShowConfirmModal={setNext}
            setProposingAmount={setProposingAmount}
            wakuVoting={wakuVoting}
          />{' '}
        </Modal>
      )}
      {showConfirmModal && (
        <Modal heading={votingRoom.question} setShowModal={hideConfirm} theme={theme}>
          <VoteAnimatedModal
            votingRoom={modifiedVotingRoom}
            selectedVote={selectedVoted}
            setShowModal={hideConfirm}
            proposingAmount={proposingAmount}
          />
        </Modal>
      )}
      {votingRoom.voteWinner ? (
        <CardHeading>Proposal {votingRoom.voteWinner == 1 ? 'rejected' : 'passed'}</CardHeading>
      ) : (
        <CardHeading />
      )}

      <VoteChart votingRoom={modifiedVotingRoom} selectedVote={selectedVoted} />

      <CardButtons>
        {votingRoom.voteWinner ? (
          <></>
        ) : (
          <VotesBtns>
            <VoteBtnAgainst
              disabled={!account}
              onClick={() => {
                setSelectedVoted(0)
                setShowVoteModal(true)
              }}
            >
              Vote Against
            </VoteBtnAgainst>
            <VoteBtnFor
              disabled={!account}
              onClick={() => {
                setSelectedVoted(1)
                setShowVoteModal(true)
              }}
            >
              Vote For
            </VoteBtnFor>
          </VotesBtns>
        )}
      </CardButtons>

      <CardVoteBottom>
        <CardViewLink>
          {' '}
          <ViewLink address={'#'} />
        </CardViewLink>
        <VoteSubmitButton votes={sum.toNumber()} disabled={!account} onClick={() => wakuVoting.commitVotes(votes)} />
      </CardVoteBottom>
    </Card>
  )
}

export const Card = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  width: 50%;
  padding: 24px;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.1);
  border-radius: 6px 0px 0px 6px;
  background-color: #fbfcfe;

  @media (max-width: 768px) {
    width: 100%;
    box-shadow: none;
    border-radius: unset;
    background-color: unset;
    padding-top: 0;
  }

  @media (max-width: 600px) {
    flex-direction: column;
    padding: 0;
    border-bottom: none;
  }
`

export const CardHeading = styled.h2`
  height: 24px;
  font-weight: bold;
  font-size: 17px;
  line-height: 24px;
  margin: 0;
  margin-bottom: 15px;

  @media (max-width: 768px) {
    font-size: 15px;
    line-height: 22px;
    margin-bottom: 6px;
  }

  @media (max-width: 600px) {
    display: none;
  }
`

const CardButtons = styled.div`
  width: 100%;

  @media (max-width: 600px) {
    display: none;
  }
`

export const VotesBtns = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;

  @media (max-width: 600px) {
    margin-top: 24px;
  }
`

const CardVoteBottom = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  width: 100%;
  margin-top: 24px;

  @media (max-width: 768px) {
    justify-content: space-between;
  }

  @media (max-width: 600px) {
    display: none;
  }
`
const CardViewLink = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: block;
  }
`

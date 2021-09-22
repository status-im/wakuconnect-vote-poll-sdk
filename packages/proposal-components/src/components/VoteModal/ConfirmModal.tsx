import { WakuVoting } from '@status-waku-voting/core'
import { VotingRoom } from '@status-waku-voting/core/dist/esm/src/types/PollType'
import React from 'react'
import styled from 'styled-components'
import { FinalBtn } from '../Buttons'
import { VoteChart } from '../ProposalVoteCard/VoteChart'

interface ConfirmModalProps {
  votingRoom: VotingRoom
  proposingAmount: number
  selectedVote: number
  setShowModal: (val: boolean) => void
  wakuVoting: WakuVoting
  className: string
}

export function ConfirmModal({
  votingRoom,
  selectedVote,
  proposingAmount,
  setShowModal,
  wakuVoting,
  className,
}: ConfirmModalProps) {
  return (
    <VoteConfirm>
      <ConfirmText>Your vote {selectedVote === 0 ? 'against' : 'for'} this proposal has been cast!</ConfirmText>
      <VoteChart
        votingRoom={votingRoom}
        proposingAmount={proposingAmount}
        selectedVote={selectedVote}
        isAnimation={true}
        wakuVoting={wakuVoting}
        className={className}
      />

      <FinalBtn onClick={() => setShowModal(false)}>Close</FinalBtn>
    </VoteConfirm>
  )
}

const VoteConfirm = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 32px;
`

const ConfirmText = styled.div`
  margin-bottom: 32px;
  text-align: center;
  line-height: 22px;

  & > span {
    font-weight: bold;
  }
`

import React from 'react'
import styled from 'styled-components'
import { VoteChart } from './ProposalVoteCard/VoteChart'
import { DisabledButton, VoteBtnAgainst, VoteBtnFor } from './Buttons'
import { VotePropose } from './VotePropose'

export interface VoteModalProps {
  votesFor: number
  votesAgainst: number
  timeLeft: number
  voteWinner?: number
  selectedVote: number
  availableAmount: number
  proposingAmount: number
  setShowConfirmModal: (show: boolean) => void
  setProposingAmount: (val: number) => void
}

export function VoteModal({
  votesFor,
  votesAgainst,
  timeLeft,
  voteWinner,
  selectedVote,
  availableAmount,
  proposingAmount,
  setShowConfirmModal,
  setProposingAmount,
}: VoteModalProps) {
  const disabled = proposingAmount === 0
  const funds = availableAmount > 0

  return (
    <Column>
      <VoteChart
        votesFor={votesFor}
        votesAgainst={votesAgainst}
        timeLeft={timeLeft}
        voteWinner={voteWinner}
        proposingAmount={proposingAmount}
        selectedVote={selectedVote}
      />
      <VotePropose
        availableAmount={availableAmount}
        setProposingAmount={setProposingAmount}
        proposingAmount={proposingAmount}
      />

      {!funds && <DisabledButton>Not enought ABC to vote</DisabledButton>}

      {funds &&
        (selectedVote === 0 ? (
          <ModalVoteBtnAgainst disabled={disabled} onClick={() => setShowConfirmModal(true)}>
            Vote Against
          </ModalVoteBtnAgainst>
        ) : (
          <ModalVoteBtnFor disabled={disabled} onClick={() => setShowConfirmModal(true)}>
            Vote For
          </ModalVoteBtnFor>
        ))}
    </Column>
  )
}

const Column = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 32px;
`

const ModalVoteBtnAgainst = styled(VoteBtnAgainst)`
  width: 100%;
  margin-top: 32px;
`
const ModalVoteBtnFor = styled(VoteBtnFor)`
  width: 100%;
  margin-top: 32px;
`

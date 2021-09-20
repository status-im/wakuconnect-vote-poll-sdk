import React from 'react'
import styled from 'styled-components'
import { VoteChart } from './ProposalVoteCard/VoteChart'
import { DisabledButton, VoteBtnAgainst, VoteBtnFor } from './Buttons'
import { VotePropose } from './VotePropose'
import { VotingRoom } from '@status-waku-voting/core/dist/esm/src/types/PollType'
import { WakuVoting } from '@status-waku-voting/core'
import { BigNumber } from 'ethers'

export interface VoteModalProps {
  votingRoom: VotingRoom
  availableAmount: number
  selectedVote: number
  proposingAmount: number
  setShowConfirmModal: (show: boolean) => void
  setProposingAmount: (val: number) => void
  wakuVoting: WakuVoting
}

export function VoteModal({
  votingRoom,
  selectedVote,
  availableAmount,
  proposingAmount,
  setShowConfirmModal,
  setProposingAmount,
  wakuVoting,
}: VoteModalProps) {
  const disabled = proposingAmount === 0
  const funds = availableAmount > 0

  return (
    <Column>
      <VoteChart votingRoom={votingRoom} proposingAmount={proposingAmount} selectedVote={selectedVote} />
      <VotePropose
        availableAmount={availableAmount}
        setProposingAmount={setProposingAmount}
        proposingAmount={proposingAmount}
      />

      {!funds && <DisabledButton>Not enought ABC to vote</DisabledButton>}

      {funds && (
        <ModalVoteBtnAgainst
          disabled={disabled}
          onClick={async () => {
            wakuVoting.sendVote(votingRoom.id, selectedVote, BigNumber.from(proposingAmount))
            setShowConfirmModal(true)
          }}
        >
          {selectedVote === 0 ? `Vote Against` : `Vote For`}
        </ModalVoteBtnAgainst>
      )}
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

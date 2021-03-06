import React, { useCallback } from 'react'
import styled from 'styled-components'
import { VoteChart } from '../ProposalVoteCard/VoteChart'
import { DisabledButton, VoteBtnAgainst, VoteBtnFor } from '../Buttons'
import { VotePropose } from '../VotePropose'
import { VotingRoom } from '@waku/vote-poll-sdk-core/dist/esm/src/types/PollType'
import { WakuVoting } from '@waku/vote-poll-sdk-core'
import { BigNumber } from 'ethers'

export interface AmountModalProps {
  votingRoom: VotingRoom
  availableAmount: number
  selectedVote: number
  proposingAmount: number
  setShowConfirmModal: (show: boolean) => void
  setProposingAmount: (val: number) => void
  wakuVoting: WakuVoting
  className: string
}

export function AmountModal({
  votingRoom,
  selectedVote,
  availableAmount,
  proposingAmount,
  setShowConfirmModal,
  setProposingAmount,
  wakuVoting,
  className,
}: AmountModalProps) {
  const disabled = proposingAmount === 0
  const funds = availableAmount > 0
  const onClick = useCallback(async () => {
    await wakuVoting.sendVote(votingRoom.id, selectedVote, BigNumber.from(proposingAmount))
    setShowConfirmModal(true)
  }, [votingRoom, selectedVote, proposingAmount, wakuVoting])
  return (
    <Column>
      <VoteChart
        votingRoom={votingRoom}
        proposingAmount={proposingAmount}
        selectedVote={selectedVote}
        wakuVoting={wakuVoting}
        className={className}
      />
      <VotePropose
        availableAmount={availableAmount}
        setProposingAmount={setProposingAmount}
        proposingAmount={proposingAmount}
        wakuVoting={wakuVoting}
      />

      {!funds && <DisabledButton>Not enough {wakuVoting.tokenSymbol} to vote</DisabledButton>}

      {funds && selectedVote === 0 ? (
        <BtnAgainst disabled={disabled} onClick={onClick}>
          Vote Against
        </BtnAgainst>
      ) : (
        <BtnFor disabled={disabled} onClick={onClick}>
          Vote For
        </BtnFor>
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

const BtnAgainst = styled(VoteBtnAgainst)`
  width: 100%;
  margin-top: 32px;
`
const BtnFor = styled(VoteBtnFor)`
  width: 100%;
  margin-top: 32px;
`

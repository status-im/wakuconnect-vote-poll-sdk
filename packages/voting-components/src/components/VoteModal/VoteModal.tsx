import React, { useEffect, useMemo, useState } from 'react'
import { VotingRoom } from '@dappconnect/vote-poll-sdk-core/dist/esm/src/types/PollType'
import { Modal, Theme } from '@status-waku-voting/react-components'
import { AmountModal } from './AmountModal'
import { ConfirmModal } from './ConfirmModal'
import { WakuVoting } from '@dappconnect/vote-poll-sdk-core'

export interface VoteModalProps {
  setShowModal: (val: boolean) => void
  showModal: boolean
  votingRoom: VotingRoom
  availableAmount: number
  selectedVote: number
  wakuVoting: WakuVoting
  theme: Theme
  className?: string
}

export function VoteModal({
  setShowModal,
  showModal,
  votingRoom,
  availableAmount,
  selectedVote,
  wakuVoting,
  theme,
  className,
}: VoteModalProps) {
  const [screen, setScreen] = useState(0)
  const votingRoomSnap = useMemo(() => Object.assign({}, votingRoom), [showModal])
  useEffect(() => setScreen(0), [])
  const [proposingAmount, setProposingAmount] = useState(0)
  useEffect(() => {
    setScreen(0)
    setProposingAmount(0)
  }, [showModal])
  return (
    <>
      {showModal && (
        <Modal heading={votingRoom.question} setShowModal={setShowModal} theme={theme}>
          {screen == 0 ? (
            <AmountModal
              votingRoom={votingRoom}
              availableAmount={availableAmount}
              selectedVote={selectedVote}
              proposingAmount={proposingAmount}
              setShowConfirmModal={() => setScreen(1)}
              setProposingAmount={setProposingAmount}
              wakuVoting={wakuVoting}
              className={className ?? ''}
            />
          ) : (
            <ConfirmModal
              votingRoom={votingRoomSnap}
              selectedVote={selectedVote}
              setShowModal={() => {
                setShowModal(false)
              }}
              wakuVoting={wakuVoting}
              className={className ?? ''}
              proposingAmount={proposingAmount}
            />
          )}
        </Modal>
      )}
    </>
  )
}

import { WakuVoting } from '@waku/vote-poll-sdk-core'
import { Modal, Theme } from '@waku/vote-poll-sdk-react-components'
import React, { useEffect, useState } from 'react'
import { VotingRoomDetailInput } from './VotingRoomDetailInput'
import { TokenAmountScreen } from './TokenAmountScreen'

type NewVotingRoomModalProps = {
  theme: Theme
  showModal: boolean
  setShowModal: (val: boolean) => void
  availableAmount: number
  wakuVoting: WakuVoting
}

export function NewVotingRoomModal({
  theme,
  showModal,
  setShowModal,
  availableAmount,
  wakuVoting,
}: NewVotingRoomModalProps) {
  const [screen, setScreen] = useState(1)
  const [title, setTitle] = useState('')
  const [text, setText] = useState('')

  useEffect(() => {
    if (!showModal) {
      setScreen(1)
      setTitle('')
      setText('')
    }
  }, [showModal])

  if (!showModal) {
    return null
  }

  return (
    <Modal heading="Create proposal" theme={theme} setShowModal={setShowModal}>
      {screen === 1 && (
        <VotingRoomDetailInput
          title={title}
          text={text}
          setText={setText}
          setTitle={setTitle}
          availableAmount={availableAmount}
          setShowProposeVoteModal={() => setScreen(2)}
          wakuVoting={wakuVoting}
        />
      )}
      {screen === 2 && (
        <TokenAmountScreen
          wakuVoting={wakuVoting}
          title={title}
          text={text}
          availableAmount={availableAmount}
          setText={setText}
          setTitle={setTitle}
          callbackAfterVote={() => setShowModal(false)}
        />
      )}
    </Modal>
  )
}

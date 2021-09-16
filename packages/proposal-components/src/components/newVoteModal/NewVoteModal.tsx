import { WakuVoting } from '@status-waku-voting/core'
import { Modal, Theme } from '@status-waku-voting/react-components'
import React, { useCallback, useEffect, useState } from 'react'
import { ProposeModal } from './ProposeModal'
import { ProposeVoteModal } from './ProposeVoteModal'

type NewVoteModalProps = {
  theme: Theme
  showModal: boolean
  setShowModal: (val: boolean) => void
  availableAmount: number
  wakuVoting: WakuVoting
}

export function NewVoteModal({ theme, showModal, setShowModal, availableAmount, wakuVoting }: NewVoteModalProps) {
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
        <ProposeModal
          title={title}
          text={text}
          setText={setText}
          setTitle={setTitle}
          availableAmount={availableAmount}
          setShowProposeVoteModal={() => setScreen(2)}
        />
      )}
      {screen === 2 && (
        <ProposeVoteModal
          wakuVoting={wakuVoting}
          title={title}
          text={text}
          availableAmount={availableAmount}
          setShowModal={setShowModal}
          setText={setText}
          setTitle={setTitle}
        />
      )}
    </Modal>
  )
}

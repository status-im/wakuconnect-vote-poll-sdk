import React from 'react'
import { addCommas } from '../../helpers/addCommas'
import { VoteSendingBtn } from '../Buttons'

interface VoteSubmitButtonProps {
  votes: number
  disabled: boolean
  onClick: () => void
}

export function VoteSubmitButton({ votes, disabled, onClick }: VoteSubmitButtonProps) {
  if (votes > 0) {
    return (
      <VoteSendingBtn onClick={onClick} disabled={disabled}>
        {' '}
        {addCommas(votes)} votes need saving
      </VoteSendingBtn>
    )
  }
  return null
}

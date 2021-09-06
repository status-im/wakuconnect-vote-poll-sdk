import React from 'react'
import { addCommas } from '../../helpers/addCommas'
import { VoteSendingBtn } from '../Buttons'

interface VoteSubmitButtonProps {
  votes: number
  disabled: boolean
}

export function VoteSubmitButton({ votes, disabled }: VoteSubmitButtonProps) {
  if (votes > 0) {
    return <VoteSendingBtn disabled={disabled}> {addCommas(votes)} votes need saving</VoteSendingBtn>
  }
  return null
}

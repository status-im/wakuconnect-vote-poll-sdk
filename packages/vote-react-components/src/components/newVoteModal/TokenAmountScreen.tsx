import { WakuVoting } from '@waku/vote-poll-sdk-core'
import { useEthers } from '@usedapp/core'
import React, { useState } from 'react'
import styled from 'styled-components'
import { ProposingBtn } from '../Buttons'
import { CardHeading, CardText } from '../ProposalInfo'
import { ProposingData } from './VotingRoomDetailInput'
import { VotePropose } from '../VotePropose'
import { BigNumber } from 'ethers'

interface TokenAmountScreenProps {
  wakuVoting: WakuVoting
  availableAmount: number
  title: string
  text: string
  setTitle: (val: string) => void
  setText: (val: string) => void
  className?: string
  callbackAfterVote?: () => void
}

export function TokenAmountScreen({
  wakuVoting,
  availableAmount,
  title,
  text,
  setTitle,
  setText,
  className,
  callbackAfterVote,
}: TokenAmountScreenProps) {
  const [proposingAmount, setProposingAmount] = useState(0)
  return (
    <ProposingData className={className ?? ''}>
      <ProposingCardHeading>{title}</ProposingCardHeading>
      <ProposingCardText>{text}</ProposingCardText>

      <VoteProposeWrap>
        <VotePropose
          availableAmount={availableAmount}
          setProposingAmount={setProposingAmount}
          proposingAmount={proposingAmount}
          wakuVoting={wakuVoting}
        />
      </VoteProposeWrap>

      <ProposingBtn
        onClick={() => {
          wakuVoting.createVote(title, text, BigNumber.from(proposingAmount))
          setTitle('')
          setText('')
          if (callbackAfterVote) {
            callbackAfterVote()
          }
        }}
      >
        Create proposal
      </ProposingBtn>
    </ProposingData>
  )
}

export const VoteProposeWrap = styled.div`
  margin-bottom: 32px;
  width: 100%;
`

const ProposingCardHeading = styled(CardHeading)`
  margin-bottom: 16px;

  &.mobile {
    margin-bottom: 0px;
    font-size: 22px;
    margin-top: 24px;
  }
`
const ProposingCardText = styled(CardText)`
  margin-bottom: 0;
`

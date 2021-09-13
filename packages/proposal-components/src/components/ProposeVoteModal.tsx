import { WakuVoting } from '@status-waku-voting/core'
import { useEthers } from '@usedapp/core'
import React, { useState } from 'react'
import styled from 'styled-components'
import { ProposingBtn } from './Buttons'
import { CardHeading, CardText } from './ProposalInfo'
import { ProposingData } from './ProposeModal'
import { VotePropose } from './VotePropose'
import { BigNumber } from 'ethers'

interface ProposeVoteModalProps {
  wakuVoting: WakuVoting
  availableAmount: number
  title: string
  text: string
  setShowModal: (val: boolean) => void
  setTitle: (val: string) => void
  setText: (val: string) => void
}

export function ProposeVoteModal({
  wakuVoting,
  availableAmount,
  title,
  text,
  setShowModal,
  setTitle,
  setText,
}: ProposeVoteModalProps) {
  const { library } = useEthers()
  const [proposingAmount, setProposingAmount] = useState(0)
  return (
    <ProposingData>
      <ProposingCardHeading>{title}</ProposingCardHeading>
      <ProposingCardText>{text}</ProposingCardText>

      <VoteProposeWrap>
        <VotePropose
          availableAmount={availableAmount}
          setProposingAmount={setProposingAmount}
          proposingAmount={proposingAmount}
        />
      </VoteProposeWrap>

      <ProposingBtn
        onClick={() => {
          if (library) wakuVoting.createVote(library.getSigner(), title, text, BigNumber.from(proposingAmount))
          setShowModal(false)
          setTitle('')
          setText('')
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
`
const ProposingCardText = styled(CardText)`
  margin-bottom: 0;
`

import { blueTheme } from '@status-waku-voting/react-components/dist/esm/src/style/themes'
import React, { useState } from 'react'
import styled from 'styled-components'
import { useHistory } from 'react-router'
import { ProposingBtn } from '../Buttons'
import { CardHeading, CardText } from '../ProposalInfo'
import {
  InfoText,
  Label,
  ProposingData,
  ProposingInfo,
  ProposingInput,
  ProposingTextInput,
} from '../newVoteModal/ProposeModal'
import { VotePropose } from '../VotePropose'

interface ProposeVoteModalProps {
  availableAmount: number
}

export function ProposeMobile({ availableAmount }: ProposeVoteModalProps) {
  const insufficientFunds = availableAmount < 10000
  const [proposingAmount, setProposingAmount] = useState(0)
  const [title, setTitle] = useState('')
  const [text, setText] = useState('')
  const [customData, setCustomData] = useState(false)
  const history = useHistory()

  return (
    <ProposingDataMobile>
      {insufficientFunds && (
        <ProposingInfo>
          <span>⚠️</span>
          <InfoText>You need at least 10,000 ABC to create a proposal!</InfoText>
        </ProposingInfo>
      )}
      <ProposingCardHeading>Create proposal</ProposingCardHeading>

      {!customData && (
        <ProposingCustomData>
          <Label>
            Title
            <ProposingInput
              cols={2}
              maxLength={90}
              placeholder="E.g. Change the rate of the token issuance"
              value={title}
              onInput={(e) => {
                setTitle(e.currentTarget.value)
              }}
              required
            />
          </Label>

          <Label>
            Description
            <ProposingTextInput
              maxLength={440}
              placeholder="Describe your proposal as detailed as you can in 440 characters."
              value={text}
              onInput={(e) => {
                setText(e.currentTarget.value)
              }}
              required
            />
          </Label>

          <ProposingBtn
            disabled={!text || !title || insufficientFunds}
            theme={blueTheme}
            onClick={() => setCustomData(true)}
          >
            Continue
          </ProposingBtn>
        </ProposingCustomData>
      )}

      {customData && (
        <ProposingCustomData>
          <CustomProposingHeading>{title}</CustomProposingHeading>
          <ProposingCardText>{text}</ProposingCardText>

          <VoteProposeWrap>
            <VotePropose
              availableAmount={availableAmount}
              setProposingAmount={setProposingAmount}
              proposingAmount={proposingAmount}
            />
          </VoteProposeWrap>

          <ProposingBtn
            disabled={proposingAmount === 0}
            onClick={() => {
              history.push(`/proposal`), setTitle(''), setText('')
            }}
          >
            Create proposal
          </ProposingBtn>
        </ProposingCustomData>
      )}
    </ProposingDataMobile>
  )
}

const ProposingDataMobile = styled(ProposingData)`
  padding: 88px 16px 32px;
  margin-top: 0;
`
export const VoteProposeWrap = styled.div`
  margin-bottom: 32px;
  width: 100%;
`

const ProposingCustomData = styled.div`
  width: 100%;
`

const ProposingCardHeading = styled(CardHeading)`
  margin-bottom: 16px;
`
const CustomProposingHeading = styled(ProposingCardHeading)`
  font-size: 22px;
  margin-top: 24px;
`

const ProposingCardText = styled(CardText)`
  margin-bottom: 0;
`

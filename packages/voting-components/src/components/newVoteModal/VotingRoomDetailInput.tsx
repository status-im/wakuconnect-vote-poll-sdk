import React, { useMemo } from 'react'
import styled from 'styled-components'
import { ProposingBtn } from '../Buttons'
import { TextArea } from '../Input'
import { blueTheme } from '@dappconnect/vote-poll-sdk-react-components/dist/esm/src/style/themes'
import { WakuVoting } from '@dappconnect/vote-poll-sdk-core'

interface VotingRoomDetailInputProps {
  availableAmount: number
  title: string
  text: string
  setShowProposeVoteModal: (val: boolean) => void
  setTitle: (val: string) => void
  setText: (val: string) => void
  wakuVoting: WakuVoting
  className?: string
}

export function VotingRoomDetailInput({
  availableAmount,
  title,
  text,
  setShowProposeVoteModal,
  setTitle,
  setText,
  wakuVoting,
  className,
}: VotingRoomDetailInputProps) {
  const insufficientFunds = useMemo(() => availableAmount < 10000, [availableAmount])

  return (
    <ProposingData className={className ?? ''}>
      {availableAmount < 10000 && (
        <ProposingInfo className={className ?? ''}>
          <span>⚠️</span>
          <InfoText>You need at least 10,000 {wakuVoting.tokenSymbol} to create a proposal!</InfoText>
        </ProposingInfo>
      )}
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
        onClick={() => setShowProposeVoteModal(true)}
      >
        Continue
      </ProposingBtn>
    </ProposingData>
  )
}

export const VoteProposeWrap = styled.div`
  margin-top: 32px;

  &.mobile {
    margin-bottom: 32px;
    width: 100%;
  }
`

export const ProposingData = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 32px;

  &.mobile {
    margin-top: 0px;
    width: 100%;
  }
`

export const ProposingInfo = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 10px 16px;
  margin-bottom: 32px;
  background: #ffeff2;

  &.mobile {
    max-width: 525px;
  }

  & > span {
    font-size: 24px;
    line-height: 32px;
    margin-right: 24px;
  }
`

export const InfoText = styled.div`
  font-size: 12px;
  line-height: 16px;
  letter-spacing: 0.1px;
`

export const ProposingInput = styled(TextArea)`
  height: 68px;
`
export const ProposingTextInput = styled(ProposingInput)`
  height: 222px;
`
export const Label = styled.label`
  width: 100%;
  font-size: 15px;
  line-height: 22px;
  align-self: flex-start;
`

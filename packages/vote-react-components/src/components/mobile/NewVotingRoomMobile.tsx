import React, { useState } from 'react'
import styled from 'styled-components'
import { CardHeading } from '../ProposalInfo'
import { VotingRoomDetailInput, ProposingData } from '../newVoteModal/VotingRoomDetailInput'
import { TokenAmountScreen } from '../newVoteModal/TokenAmountScreen'
import { WakuVoting } from '@waku/vote-poll-sdk-core'

interface NewVotingRoomMobileProps {
  availableAmount: number
  wakuVoting: WakuVoting
  callbackAfterVote: () => void
}

export function NewVotingRoomMobile({ availableAmount, wakuVoting, callbackAfterVote }: NewVotingRoomMobileProps) {
  const [title, setTitle] = useState('')
  const [text, setText] = useState('')
  const [screen, setScreen] = useState(1)

  return (
    <ProposingDataMobile>
      <ProposingCardHeading>Create proposal</ProposingCardHeading>
      {screen === 1 && (
        <VotingRoomDetailInput
          availableAmount={availableAmount}
          text={text}
          setText={setText}
          title={title}
          setTitle={setTitle}
          setShowProposeVoteModal={() => setScreen(2)}
          wakuVoting={wakuVoting}
          className={'mobile'}
        />
      )}
      {screen == 2 && (
        <TokenAmountScreen
          wakuVoting={wakuVoting}
          title={title}
          text={text}
          availableAmount={availableAmount}
          setText={setText}
          setTitle={setTitle}
          className={'mobile'}
          callbackAfterVote={callbackAfterVote}
        />
      )}
    </ProposingDataMobile>
  )
}

const ProposingDataMobile = styled(ProposingData)`
  padding: 88px 16px 32px;
  margin-top: 0;
`

const ProposingCardHeading = styled(CardHeading)`
  margin-bottom: 16px;
`

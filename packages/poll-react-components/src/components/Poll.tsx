import { WakuPolling } from '@waku/vote-poll-sdk-core'
import { DetailedTimedPoll } from '@waku/vote-poll-sdk-core/dist/esm/src/models/DetailedTimedPoll'
import { BigNumber } from 'ethers'
import React, { useEffect, useState } from 'react'
import { PollType } from '@waku/vote-poll-sdk-core/dist/esm/src/types/PollType'
import styled from 'styled-components'
import { RadioGroup, SmallButton, Theme } from '@waku/vote-poll-sdk-react-components'
import { PollResults } from './PollResults'
import { Modal } from '@waku/vote-poll-sdk-react-components'

type PollProps = {
  theme: Theme
  poll: DetailedTimedPoll
  wakuPolling: WakuPolling | undefined
  account: string | null | undefined
}

export function Poll({ poll, wakuPolling, theme, account }: PollProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | undefined>(undefined)
  const [tokenAmount, setTokenAmount] = useState(0)
  const [userInVoters, setUserInVoters] = useState(-1)
  const [showNotEnoughTokens, setShowNotEnoughTokens] = useState(false)

  useEffect(() => {
    if (account) {
      const msg = poll.votesMessages.find((vote) => vote.voter === account)
      setUserInVoters(msg?.answer ?? -1)
    }
  }, [poll, account])

  return (
    <PollWrapper>
      <PollTitle>{poll.poll.question}</PollTitle>
      <PollAnswersWrapper>
        {userInVoters < 0 && (
          <VotingWrapper>
            <RadioGroup
              options={poll.poll.answers}
              setSelectedOption={setSelectedAnswer}
              selectedOption={selectedAnswer}
            />
            {poll.poll.pollType === PollType.WEIGHTED && (
              <div>
                Token amount
                <input
                  onChange={(e) => setTokenAmount(Number.parseInt(e.target.value))}
                  value={tokenAmount}
                  type="number"
                />
              </div>
            )}
          </VotingWrapper>
        )}
        {userInVoters > -1 && <PollResults poll={poll} selectedVote={userInVoters} />}
      </PollAnswersWrapper>
      {userInVoters < 0 && (
        <SmallButton
          disabled={!account || selectedAnswer === undefined}
          onClick={async () => {
            if (wakuPolling && account && selectedAnswer !== undefined) {
              const result = await wakuPolling.sendTimedPollVote(
                poll.poll.id,
                selectedAnswer,
                poll.poll.pollType === PollType.WEIGHTED ? BigNumber.from(tokenAmount) : undefined
              )
              if (result === 1) {
                setShowNotEnoughTokens(true)
              }
            }
          }}
        >
          {' '}
          Vote
        </SmallButton>
      )}
      {showNotEnoughTokens && (
        <Modal heading={''} setShowModal={setShowNotEnoughTokens} theme={theme}>
          <ModalTextWrapper>You don't have enough tokens to vote</ModalTextWrapper>
        </Modal>
      )}
    </PollWrapper>
  )
}

const ModalTextWrapper = styled.div`
  text-align: center;
  margin: 32px 0;
`

const VotingWrapper = styled.div`
  margin-top: 40px;
  margin-left: 32px;
`

const PollWrapper = styled.div`
  display: flex;
  width: 344px;
  flex-direction: column;
  align-items: center;
  box-shadow: 0px 2px 12px rgba(0, 0, 0, 0.15);
  border-radius: 6px;
  background-color: #fbfbfe;
  padding: 32px;

  @media (max-width: 768px) {
    padding: 24px;
  }
`

const PollTitle = styled.div`
  width: 100%;
  text-align: center;
  font-weight: bold;
  font-size: 22px;
  line-height: 24px;
  word-break: break-all;
`

const PollAnswersWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-self: flex-start;
  width: 100%;
`

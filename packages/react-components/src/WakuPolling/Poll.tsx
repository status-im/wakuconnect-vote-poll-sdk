import WakuVoting from '@status-waku-voting/core'
import { DetailedTimedPoll } from '@status-waku-voting/core/dist/esm/src/models/DetailedTimedPoll'
import { Wallet, BigNumber } from 'ethers'
import React, { useEffect, useState } from 'react'
import { JsonRpcSigner } from '@ethersproject/providers'
import { PollType } from '@status-waku-voting/core/dist/esm/src/types/PollType'
import styled from 'styled-components'
import checkIcon from '../assets/svg/checkIcon.svg'
import { RadioGroup } from '../components/radioGroup'
import { SmallButton } from '../components/misc/Buttons'
import { PollResults } from './PollResults'

type PollProps = {
  poll: DetailedTimedPoll
  wakuVoting: WakuVoting | undefined
  signer: Wallet | JsonRpcSigner
}

export function Poll({ poll, wakuVoting, signer }: PollProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | undefined>(undefined)
  const [tokenAmount, setTokenAmount] = useState(0)
  const [address, setAddress] = useState('')
  const [userInVoters, setUserInVoters] = useState(false)

  useEffect(() => {
    signer.getAddress().then((e) => setAddress(e))
  }, [signer])

  useEffect(() => {
    setUserInVoters(!!poll.votesMessages.find((vote) => vote.voter === address))
  }, [poll, address])

  return (
    <PollWrapper>
      <PollTitle>{poll.poll.question}</PollTitle>
      <PollAnswersWrapper>
        {!userInVoters && (
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
        {userInVoters && <PollResults poll={poll} />}
      </PollAnswersWrapper>
      {!userInVoters && (
        <SmallButton
          onClick={() => {
            if (wakuVoting) {
              wakuVoting.sendTimedPollVote(
                signer,
                poll.poll.id,
                selectedAnswer ?? 0,
                poll.poll.pollType === PollType.WEIGHTED ? BigNumber.from(tokenAmount) : undefined
              )
            }
          }}
        >
          {' '}
          Vote
        </SmallButton>
      )}
    </PollWrapper>
  )
}

const VotingWrapper = styled.div`
  margin-left: 46px;
  margin-top: 38px;
`

const PollWrapper = styled.div`
  display: flex;
  width: 442px;
  flex-direction: column;
  box-shadow: 0px 2px 12px 0px #000000;
  border-radius: 5px;
  background-color: #fbfbfe;
  margin-bottom: 24px;
`

const PollTitle = styled.div`
  margin-top: 32px;
  width: 100%;
  text-align: center;
  font-weight: bold;
  font-size: 22px;
`

const PollAnswersWrapper = styled.div`
  display: flex;
  flex-direction: column;
`

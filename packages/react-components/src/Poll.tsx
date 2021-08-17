import WakuVoting from '@status-waku-voting/core'
import { DetailedTimedPoll } from '@status-waku-voting/core/dist/esm/src/models/DetailedTimedPoll'
import { Wallet, BigNumber } from 'ethers'
import React, { useEffect, useState } from 'react'
import { JsonRpcSigner } from '@ethersproject/providers'
import { PollType } from '@status-waku-voting/core/dist/esm/src/types/PollType'
import styled from 'styled-components'

type PollProps = {
  poll: DetailedTimedPoll
  wakuVoting: WakuVoting | undefined
  signer: Wallet | JsonRpcSigner
}

export function Poll({ poll, wakuVoting, signer }: PollProps) {
  const [selectedAnswer, setSelectedAnswer] = useState(0)
  const [tokenAmount, setTokenAmount] = useState(0)
  const [address, setAddress] = useState('')
  const [userInVoters, setUserInVoters] = useState(false)
  useEffect(() => {
    signer.getAddress().then((e) => setAddress(e))
  }, [signer])

  useEffect(() => {
    setUserInVoters(!!poll.votesMessages.find((vote) => vote.voter === address))
  }, [poll])

  return (
    <PollWrapper>
      <PollTitle>
        <PollQuestion>{poll.poll.question}</PollQuestion>
        <TitleInfo>
          <PollTypeWrapper>{poll.poll.pollType === PollType.WEIGHTED ? 'WEIGHTED' : 'NON WEIGHTED'}</PollTypeWrapper>
          <DateWrapper>{new Date(poll.poll.endTime).toLocaleString()}</DateWrapper>
        </TitleInfo>
      </PollTitle>
      <PollAnswersWrapper>
        {!userInVoters && (
          <div>
            <div onChange={(e) => setSelectedAnswer(Number.parseInt((e.target as any).value ?? 0))}>
              {poll.poll.answers.map((answer, idx) => {
                return (
                  <PollAnswer key={idx}>
                    <input type="radio" value={idx} name={poll.poll.id} /> {answer}
                  </PollAnswer>
                )
              })}
            </div>
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
          </div>
        )}
        {userInVoters && (
          <div>
            Results
            {poll.answers.map((answer, idx) => {
              return (
                <PollAnswer key={idx}>
                  <PollAnswerText>{answer.text}</PollAnswerText>
                  <VoteCount>Votes : {answer.votes.toString()}</VoteCount>
                </PollAnswer>
              )
            })}
          </div>
        )}
      </PollAnswersWrapper>
      {!userInVoters && (
        <VoteButton
          onClick={() => {
            if (wakuVoting) {
              wakuVoting.sendTimedPollVote(
                signer,
                poll.poll.id,
                selectedAnswer,
                poll.poll.pollType === PollType.WEIGHTED ? BigNumber.from(tokenAmount) : undefined
              )
            }
          }}
        >
          {' '}
          Vote
        </VoteButton>
      )}
    </PollWrapper>
  )
}

const DateWrapper = styled.div`
  font-size: 14px;
  text-align: right;
`

const TitleInfo = styled.div`
  display: flex;
  flex-direction: column;
  margin-right: 10px;
  margin-left: auto;
  margin-top: auto;
`

const VoteButton = styled.button`
  width: 100px;
  border-radius: 5px;
  font-size: 20px;
  font-weight: bold;
  font-family: 'Times New Roman', Times, serif;
`

const VoteCount = styled.div`
  margin-left: auto;
  margin-right: 5px;
`

const PollWrapper = styled.div`
  display: flex;
  flex-direction: column;
  box-shadow: 10px 10px 31px -2px #a3a1a1;
  border-radius: 5px;
  background-color: lightgray;
  margin: 10px;
  padding: 10px;
`

const PollTitle = styled.div`
  display: flex;
  padding: 10px;
  border: 1px solid black;
  border-radius: 5px;
`

const PollQuestion = styled.div`
  display: block;
  width: 200px;
  margin-left: 10px;
  margin-top: 0px;
  overflow: auto;
`

const PollTypeWrapper = styled.div`
  width: 150px;
  text-align: right;
  color: green;
  font-size: 14px;
  font-weight: bold;
`

const PollAnswersWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin: 10px;
`

const PollAnswer = styled.div`
  display: flex;
  margin: 20px;
  width: 300px;
  border-bottom: 1px solid black;
  border-radius: 10px;
`

const PollAnswerText = styled.div`
  width: 200px;
`

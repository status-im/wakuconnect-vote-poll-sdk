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
  useEffect(() => {
    signer.getAddress().then((e) => setAddress(e))
  }, [signer])
  return (
    <div>
      {poll.poll.question}
      <ul>
        {!poll.votesMessages.find((vote) => vote.voter === address) && (
          <div onChange={(e) => setSelectedAnswer(Number.parseInt((e.target as any).value ?? 0))}>
            {poll.poll.answers.map((answer, idx) => {
              return (
                <div key={idx}>
                  <input type="radio" value={idx} name={poll.poll.id} /> {answer}
                </div>
              )
            })}
          </div>
        )}
        {poll.votesMessages.find((vote) => vote.voter === address) &&
          poll.answers.map((answer, idx) => {
            return (
              <div key={idx}>
                {answer.text}
                <VoteCount>Votes : {answer.votes.toString()}</VoteCount>
              </div>
            )
          })}
      </ul>
      {poll.poll.pollType === PollType.WEIGHTED && (
        <div>
          Token amount
          <input onChange={(e) => setTokenAmount(Number.parseInt(e.target.value))} value={tokenAmount} type="number" />
        </div>
      )}
      <button
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
      </button>
    </div>
  )
}

const VoteCount = styled.div`
  margin-left: 20px;
`

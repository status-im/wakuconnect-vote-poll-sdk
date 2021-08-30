import React from 'react'
import { DetailedTimedPoll } from '@status-waku-voting/core/dist/esm/src/models/DetailedTimedPoll'
import styled from 'styled-components'
import { colorRouletteGenerator } from '../style/colors'
import checkCircle from '../assets/svg/checkCircle.svg'

type PollResultsProps = {
  poll: DetailedTimedPoll
  selectedVote: number
}

export function PollResults({ poll, selectedVote }: PollResultsProps) {
  const colors = colorRouletteGenerator()
  return (
    <Wrapper>
      {poll.answers.map((answer, idx) => {
        let percentage = 0
        if (poll.numberOfVotes.gt(0)) {
          percentage = answer.votes.mul(1000).div(poll.numberOfVotes).toNumber() / 10
        }
        return (
          <PollAnswer
            key={idx}
            style={{
              background: `linear-gradient(90deg, ${
                colors.next().value ?? ''
              } ${percentage}%, rgba(255,255,255,0) ${percentage}%)`,
            }}
          >
            <PollAnswerWrapper>
              <PollAnswerText>{answer.text}</PollAnswerText>
              {selectedVote === idx && <CheckCircle />}
            </PollAnswerWrapper>
            <VoteCount>{`${percentage}%`}</VoteCount>
          </PollAnswer>
        )
      })}
      <ResultInfoWrapper>
        {`${poll.numberOfVotes.toString()} votes • ${Math.floor(
          (poll.poll.endTime - Date.now()) / 3600000
        )} hours left`}
      </ResultInfoWrapper>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  margin-top: 32px;
`

const PollAnswer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding: 8px 0 8px 8px;
  font-size: 16px;
  line-height: 16px;

  &:last-child {
    margin-bottom: 0;
  }
`

const PollAnswerWrapper = styled.div`
  display: flex;
`
const PollAnswerText = styled.div`
  display: inline-block;
  height: 100%;
  font-weight: 500;
  align-items: center;
  letter-spacing: 1.5px;
  text-transform: uppercase;
`

const VoteCount = styled.div`
  font-weight: 400;
`

const CheckCircle = styled.div`
  display: inline-block;
  width: 14px;
  height: 14px;
  margin-left: 8px;
  background-image: url(${checkCircle});
`

const ResultInfoWrapper = styled.div`
  margin-top: 32px;
  font-size: 15px;
  line-height: 22px;
  text-align: center;
`

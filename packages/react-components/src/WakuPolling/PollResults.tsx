import React from 'react'
import { DetailedTimedPoll } from '@status-waku-voting/core/dist/esm/src/models/DetailedTimedPoll'
import styled from 'styled-components'
import { colorRouletteGenerator } from '../style/colors'

type PollResultsProps = {
  poll: DetailedTimedPoll
}

export function PollResults({ poll }: PollResultsProps) {
  const colors = colorRouletteGenerator()
  return (
    <Wrapper>
      {poll.answers.map((answer, idx) => {
        let percentage = 0
        if (poll.numberOfVotes.gt(0)) {
          percentage = answer.votes.mul(1000).div(poll.numberOfVotes).toNumber() / 10
        }
        return (
          <PollAnswer key={idx}>
            <ColorBar style={{ backgroundColor: colors.next().value ?? '', width: `${percentage}%` }} />
            <Transparent>
              <PollAnswerText>{answer.text}</PollAnswerText>
              <VoteCount>{`${percentage}%`}</VoteCount>
            </Transparent>
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

const Transparent = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  z-index: 2;
`

const ColorBar = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 2px;
  position: absolute;
  top: 0px;
  left: 0px;
  z-index: 1;
`

const Wrapper = styled.div`
  margin-left: 77px;
  margin-top: 32px;
  width: 288px;
`

const ResultInfoWrapper = styled.div`
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 32px;
  margin-top: 32px;
  font-size: 15px;
  text-align: center;
`

const VoteCount = styled.div`
  margin-left: auto;
  font-weight: 400;
  font-size: 12px;
  font-family: 'Inter, sans-serif';
`

const PollAnswer = styled.div`
  display: flex;
  margin-bottom: 8px;
  position: relative;
  font-family: 'Inter, sans-serif';
`

const PollAnswerText = styled.div`
  width: 200px;
  font-weight: 700;
  font-size: 10px;
`

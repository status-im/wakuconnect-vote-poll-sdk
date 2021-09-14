import { VotingRoom } from '@status-waku-voting/core/dist/esm/src/types/PollType'
import React from 'react'
import styled from 'styled-components'
import { ViewLink } from './ViewLink'

type ProposalInfoProps = {
  votingRoom: VotingRoom
  mobileMode?: boolean
}

export function ProposalInfo({ votingRoom, mobileMode }: ProposalInfoProps) {
  return (
    <Card>
      <CardHeading>{votingRoom.question}</CardHeading>
      <CardText className={mobileMode ? 'mobile' : ''}>{votingRoom.description}</CardText>
      <CardViewLink className={mobileMode ? 'mobile' : ''}>
        <ViewLink address={'#'} />
      </CardViewLink>
    </Card>
  )
}

export const Card = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  width: 50%;
  padding: 24px;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.1);
  border-radius: 6px 0px 0px 6px;

  @media (max-width: 768px) {
    width: 100%;
    margin: 0;
    border: none;
    box-shadow: none;
    padding-bottom: 0;
  }

  @media (max-width: 600px) {
    padding: 0;
  }
`

export const CardHeading = styled.div`
  font-weight: bold;
  font-size: 22px;
  line-height: 24px;
  margin-bottom: 8px;
  align-self: flex-start;

  @media (max-width: 600px) {
    font-size: 17px;
  }
`

export const CardText = styled.div`
  font-size: 13px;
  line-height: 18px;
  margin-bottom: 16px;

  @media (max-width: 600px) {
    height: 56px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
  }

  &.mobile {
    @media (max-width: 600px) {
      height: 100%;
      overflow: unset;
      text-overflow: unset;
      -webkit-line-clamp: unset;
      margin-bottom: 24px;
    }
  }
`

const CardViewLink = styled.div`
  @media (max-width: 768px) {
    display: none;
  }

  &.mobile {
    @media (max-width: 600px) {
      display: block;
      margin-bottom: 37px;
    }
  }
`

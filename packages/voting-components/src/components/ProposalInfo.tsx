import { VotingRoom } from '@status-waku-voting/core/dist/esm/src/types/PollType'
import React from 'react'
import styled from 'styled-components'
import { ViewLink } from './ViewLink'

type ProposalInfoProps = {
  votingRoom: VotingRoom
  providerName: string
  className?: string
}

export function ProposalInfo({ votingRoom, className, providerName }: ProposalInfoProps) {
  return (
    <Card className={className}>
      <CardHeading className={className}>{votingRoom.question}</CardHeading>
      <CardText className={className}>{votingRoom.description}</CardText>
      <CardViewLink className={className}>
        <ViewLink
          address={
            votingRoom.transactionHash ? `https://${providerName}.etherscan.io/tx/${votingRoom.transactionHash}` : '#'
          }
        />
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

  &.tablet {
    width: 100%;
    margin: 0;
    border: none;
    box-shadow: none;
    padding-bottom: 0;
  }

  &.mobile {
    width: 100%;
    margin: 0;
    border: none;
    box-shadow: none;
    padding-bottom: 0;
    padding: 0;
  }
`

export const CardHeading = styled.div`
  font-weight: bold;
  font-size: 22px;
  line-height: 24px;
  margin-bottom: 8px;
  align-self: flex-start;

  &.mobile {
    font-size: 17px;
  }
`

export const CardText = styled.div`
  font-size: 13px;
  line-height: 18px;
  margin-bottom: 16px;

  &.mobile {
    height: 100%;
    overflow: unset;
    text-overflow: unset;
    -webkit-line-clamp: unset;
    margin-bottom: 24px;
  }
`

const CardViewLink = styled.div`
  &.tablet {
    display: none;
  }

  &.mobile {
    display: block;
    margin-bottom: 37px;
  }
`

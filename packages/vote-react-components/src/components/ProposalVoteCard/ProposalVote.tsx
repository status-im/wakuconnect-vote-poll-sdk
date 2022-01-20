import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { VoteBtnAgainst, VoteBtnFor } from '../Buttons'
import { VoteSubmitButton } from './VoteSubmitButton'
import { VoteChart } from './VoteChart'
import { ViewLink } from '../ViewLink'
import { VotingRoom } from '@waku/vote-poll-sdk-core/dist/esm/src/types/PollType'
import { WakuVoting } from '@waku/vote-poll-sdk-core'

interface ProposalVoteProps {
  votingRoom: VotingRoom
  selectedVote: number
  wakuVoting: WakuVoting
  account: string | null | undefined
  againstClick: () => void
  forClick: () => void
  className: string
}

export function ProposalVote({
  account,
  votingRoom,
  selectedVote,
  wakuVoting,
  againstClick,
  forClick,
  className,
}: ProposalVoteProps) {
  const [alreadyVoted, setAlreadyVoted] = useState(false)

  useEffect(() => {
    if (votingRoom.voters.findIndex((e) => e === account) >= 0) {
      setAlreadyVoted(true)
    } else {
      setAlreadyVoted(false)
    }
  }, [account, votingRoom])

  return (
    <Card className={className}>
      {votingRoom.voteWinner ? (
        <CardHeading className={className}>Proposal {votingRoom.voteWinner == 1 ? 'rejected' : 'passed'}</CardHeading>
      ) : (
        <CardHeading className={className} />
      )}

      <VoteChart votingRoom={votingRoom} selectedVote={selectedVote} wakuVoting={wakuVoting} className={className} />

      <CardButtons className={className}>
        {votingRoom.voteWinner ? (
          <></>
        ) : (
          <VotesBtns className={className}>
            <VoteBtnAgainst disabled={!account || alreadyVoted} onClick={againstClick}>
              Vote Against
            </VoteBtnAgainst>
            <VoteBtnFor disabled={!account || alreadyVoted} onClick={forClick}>
              Vote For
            </VoteBtnFor>
          </VotesBtns>
        )}
      </CardButtons>

      <CardVoteBottom className={className}>
        <CardViewLink className={className}>
          {' '}
          <ViewLink address={'#'} />
        </CardViewLink>
        <VoteSubmitButton
          votes={votingRoom?.wakuVotes?.sum.toNumber() ?? 0}
          disabled={!account}
          onClick={() => wakuVoting.commitVotes(votingRoom?.wakuVotes?.votes ?? [])}
        />
      </CardVoteBottom>
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
  background-color: #fbfcfe;

  &.tablet {
    width: 100%;
    box-shadow: none;
    border-radius: unset;
    background-color: unset;
    padding-top: 0;
  }

  &.mobile {
    width: 100%;
    box-shadow: none;
    border-radius: unset;
    background-color: unset;
    flex-direction: column;
    padding: 0;
    border-bottom: none;
  }
`

export const CardHeading = styled.h2`
  height: 24px;
  font-weight: bold;
  font-size: 17px;
  line-height: 24px;
  margin: 0;
  margin-bottom: 15px;

  &.tablet {
    font-size: 15px;
    line-height: 22px;
    margin-bottom: 6px;
  }

  &.mobile {
    font-size: 15px;
    line-height: 22px;
    margin-bottom: 6px;
    display: none;
  }
`

const CardButtons = styled.div`
  width: 100%;

  &.mobile {
    display: none;
  }
`

export const VotesBtns = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;

  &.mobile {
    margin-top: 24px;
  }
`

const CardVoteBottom = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  width: 100%;
  margin-top: 24px;

  &.tablet {
    justify-content: space-between;
  }

  &.mobile {
    display: none;
  }
`
const CardViewLink = styled.div`
  display: none;

  &.tablet {
    display: block;
  }
`

import React, { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router'
import styled from 'styled-components'
import { FinalBtn, VoteBtnAgainst, VoteBtnFor } from '../Buttons'
import { VoteSubmitButton } from '../ProposalVoteCard/VoteSubmitButton'
import { VoteChart } from '../ProposalVoteCard/VoteChart'
import { ProposalInfo } from '../ProposalInfo'
import { VotePropose } from '../VotePropose'
import { VotesBtns } from '../ProposalVoteCard/ProposalVote'
import { useVotingRoom } from '@status-waku-voting/voting-hooks'
import { WakuVoting } from '@dappconnect/vote-poll-sdk-core'
import { BigNumber } from 'ethers'
interface VotingRoomMobileProps {
  wakuVoting: WakuVoting
  availableAmount: number
  account: string | null | undefined
}

export function VotingRoomMobile({ wakuVoting, availableAmount, account }: VotingRoomMobileProps) {
  const { id } = useParams<{ id: string }>()
  const [proposingAmount, setProposingAmount] = useState(0)
  const [selectedVoted, setSelectedVoted] = useState(0)
  const votingRoom = useVotingRoom(Number(id), wakuVoting)

  const voteWinner = useMemo(() => votingRoom?.voteWinner, [votingRoom?.voteWinner])

  if (!votingRoom) {
    return <>Loading</>
  }

  return (
    <Card>
      <ProposalInfo votingRoom={votingRoom} className={'mobile'} providerName={wakuVoting.providerName} />
      <VoteChartWrap>
        <VoteChart votingRoom={votingRoom} selectedVote={selectedVoted} wakuVoting={wakuVoting} className={'mobile'} />
      </VoteChartWrap>
      {!voteWinner && (
        <VotePropose
          availableAmount={availableAmount}
          setProposingAmount={setProposingAmount}
          proposingAmount={proposingAmount}
          wakuVoting={wakuVoting}
        />
      )}

      <CardButtons>
        {voteWinner ? (
          <></>
        ) : (
          <VotesBtns>
            <VoteBtnAgainst
              disabled={!account}
              onClick={() => {
                setSelectedVoted(0)
                wakuVoting.sendVote(votingRoom.id, 0, BigNumber.from(proposingAmount))
              }}
            >
              Vote Against
            </VoteBtnAgainst>
            <VoteBtnFor
              disabled={!account}
              onClick={() => {
                setSelectedVoted(1)
                wakuVoting.sendVote(votingRoom.id, 1, BigNumber.from(proposingAmount))
              }}
            >
              Vote For
            </VoteBtnFor>
          </VotesBtns>
        )}
      </CardButtons>

      <CardVoteBottom>
        {' '}
        {votingRoom.wakuVotes && (
          <VoteSubmitButton
            votes={votingRoom.wakuVotes.sum.toNumber()}
            disabled={!account}
            onClick={() => wakuVoting.commitVotes(votingRoom?.wakuVotes?.votes ?? [])}
          />
        )}
      </CardVoteBottom>
    </Card>
  )
}

export const Card = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  width: 100vw;
  margin: 0px;
  padding: 88px 16px 32px;
`

const CardButtons = styled.div`
  width: 100%;
`

const CardVoteBottom = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-top: 32px;
`

const VoteChartWrap = styled.div`
  width: 100%;
  margin-bottom: 32px;
`

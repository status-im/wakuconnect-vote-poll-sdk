import React, { ReactElement, useCallback, useState } from 'react'
import { useHistory } from 'react-router'
import styled from 'styled-components'
import { Theme } from '@status-waku-voting/react-components'
import { ProposalInfo } from './ProposalInfo'
import { ProposalVote } from './ProposalVoteCard/ProposalVote'
import { WakuVoting } from '@status-waku-voting/core'
import { useVotingRoom } from '@status-waku-voting/proposal-hooks'
import { VoteModal, VoteModalProps } from './VoteModal/VoteModal'

interface ProposalCardProps {
  votingRoomId: number
  mobileVersion?: boolean
  theme: Theme
  hideModalFunction?: (val: boolean) => void
  availableAmount: number
  wakuVoting: WakuVoting
  account: string | null | undefined
  CustomVoteModal?: (props: VoteModalProps) => ReactElement
  customAgainstClick?: () => void
  customForClick?: () => void
}

export function ProposalCard({
  account,
  theme,
  votingRoomId,
  mobileVersion,
  availableAmount,
  wakuVoting,
  CustomVoteModal,
  customAgainstClick,
  customForClick,
}: ProposalCardProps) {
  const history = useHistory()
  const votingRoom = useVotingRoom(votingRoomId, wakuVoting)

  const [showVoteModal, setShowVoteModal] = useState(false)
  const [selectedVote, setSelectedVote] = useState(0)

  const againstClick = useCallback(() => {
    setSelectedVote(0)
    setShowVoteModal(true)
  }, [])

  const forClick = useCallback(() => {
    setSelectedVote(1)
    setShowVoteModal(true)
  }, [])

  if (!votingRoom) {
    return <></>
  }

  return (
    <Card onClick={() => mobileVersion && history.push(`/votingRoom/${votingRoom.id.toString()}`)}>
      {CustomVoteModal ? (
        <CustomVoteModal
          setShowModal={setShowVoteModal}
          showModal={showVoteModal}
          votingRoom={votingRoom}
          availableAmount={availableAmount}
          selectedVote={selectedVote}
          wakuVoting={wakuVoting}
          theme={theme}
        />
      ) : (
        <VoteModal
          setShowModal={setShowVoteModal}
          showModal={showVoteModal}
          votingRoom={votingRoom}
          availableAmount={availableAmount}
          selectedVote={selectedVote}
          wakuVoting={wakuVoting}
          theme={theme}
        />
      )}
      <ProposalInfo votingRoom={votingRoom} providerName={wakuVoting.providerName} />
      <ProposalVote
        votingRoom={votingRoom}
        selectedVote={selectedVote}
        wakuVoting={wakuVoting}
        account={account}
        againstClick={customAgainstClick ?? againstClick}
        forClick={customForClick ?? forClick}
      />
    </Card>
  )
}

export const Card = styled.div`
  display: flex;
  align-items: stretch;
  margin-bottom: 24px;

  @media (max-width: 768px) {
    flex-direction: column;
    box-shadow: 0px 1px 6px rgba(0, 0, 0, 0.15);
  }

  @media (max-width: 600px) {
    padding-bottom: 24px;
    box-shadow: none;
    border-bottom: 1px solid rgba(0, 0, 0, 0.3);
  }

  &:not:first-child {
    @media (max-width: 768px) {
      border-top: 1px solid #e0e0e0;
    }
  }
`

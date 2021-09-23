import React, { ReactElement, useCallback, useState, useRef, useMemo } from 'react'
import styled from 'styled-components'
import { Theme } from '@status-waku-voting/react-components'
import { ProposalInfo } from './ProposalInfo'
import { ProposalVote } from './ProposalVoteCard/ProposalVote'
import { WakuVoting } from '@status-waku-voting/core'
import { useVotingRoom } from '@status-waku-voting/proposal-hooks'
import { VoteModal, VoteModalProps } from './VoteModal/VoteModal'
import { useRefMobileVersion } from '@status-waku-voting/react-components'
import { VotingRoom } from '@status-waku-voting/core/dist/esm/src/types/PollType'

interface ProposalCardProps {
  votingRoomId: number
  theme: Theme
  availableAmount: number
  wakuVoting: WakuVoting
  account: string | null | undefined
  mobileOnClick?: (votingRoom: VotingRoom) => void
  CustomVoteModal?: (props: VoteModalProps) => ReactElement
  customAgainstClick?: () => void
  customForClick?: () => void
}

export function ProposalCard({
  account,
  theme,
  votingRoomId,
  availableAmount,
  wakuVoting,
  CustomVoteModal,
  customAgainstClick,
  customForClick,
  mobileOnClick,
}: ProposalCardProps) {
  const votingRoom = useVotingRoom(votingRoomId, wakuVoting)
  const ref = useRef<HTMLHeadingElement>(null)
  const mobileVersion = useRefMobileVersion(ref, 568)
  const tabletVersion = useRefMobileVersion(ref, 703)
  const className = useMemo(
    () => (mobileVersion ? 'mobile' : tabletVersion ? 'tablet' : ''),
    [mobileVersion, tabletVersion]
  )
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
    <Card className={className} ref={ref} onClick={() => mobileVersion && mobileOnClick && mobileOnClick(votingRoom)}>
      {CustomVoteModal ? (
        <CustomVoteModal
          setShowModal={setShowVoteModal}
          showModal={showVoteModal}
          votingRoom={votingRoom}
          availableAmount={availableAmount}
          selectedVote={selectedVote}
          wakuVoting={wakuVoting}
          theme={theme}
          className={className}
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
          className={className}
        />
      )}
      <ProposalInfo votingRoom={votingRoom} providerName={wakuVoting.providerName} className={className} />
      <ProposalVote
        votingRoom={votingRoom}
        selectedVote={selectedVote}
        wakuVoting={wakuVoting}
        account={account}
        againstClick={customAgainstClick ?? againstClick}
        forClick={customForClick ?? forClick}
        className={className}
      />
    </Card>
  )
}

export const Card = styled.div`
  display: flex;
  align-items: stretch;
  margin-bottom: 24px;

  &.tablet {
    flex-direction: column;
    box-shadow: 0px 1px 6px rgba(0, 0, 0, 0.15);
  }

  &.mobile {
    flex-direction: column;
    padding-bottom: 24px;
    box-shadow: none;
    border-bottom: 1px solid rgba(0, 0, 0, 0.3);
  }

  &:not:first-child {
    &.tablet {
      border-top: 1px solid #e0e0e0;
    }
  }
`

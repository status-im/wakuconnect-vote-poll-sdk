import React, { useCallback, useRef, useState } from 'react'
import styled from 'styled-components'
import {
  VotingRoomListHeader,
  VotingRoomList,
  VotingRoomListEmpty,
  NewVotingRoomModal,
} from '@dappconnect/vote-sdk-react-components'
import { blueTheme } from '@dappconnect/vote-poll-sdk-react-components/dist/esm/src/style/themes'
import { WakuVoting } from '@dappconnect/vote-poll-sdk-core'
import { useTokenBalance } from '@dappconnect/vote-poll-sdk-react-components'
import { useEthers } from '@usedapp/core'
import { Modal, Networks, useMobileVersion, Theme } from '@dappconnect/vote-poll-sdk-react-components'
import { useVotingRoomsId } from '@status-waku-voting/voting-hooks'
import { VotingRoom } from '@dappconnect/vote-poll-sdk-core/dist/esm/src/types/PollType'
import { useHistory } from 'react-router'

type VotingListHeaderProps = {
  votesLength: number
  theme: Theme
  wakuVoting: WakuVoting
  tokenBalance: number
  account: string | null | undefined
}

function VotingListHeader({ votesLength, theme, wakuVoting, tokenBalance, account }: VotingListHeaderProps) {
  const [showNewVoteModal, setShowNewVoteModal] = useState(false)
  const [showConnectionModal, setShowConnectionModal] = useState(false)
  const { activateBrowserWallet } = useEthers()
  const history = useHistory()
  const ref = useRef<HTMLHeadingElement>(null)
  const mobileVersion = useMobileVersion(600)

  const onCreateClick = useCallback(() => {
    mobileVersion ? history.push(`/creation`) : setShowNewVoteModal(true)
  }, [mobileVersion])

  const onConnectClick = useCallback(() => {
    if ((window as any)?.ethereum) {
      activateBrowserWallet()
    } else setShowConnectionModal(true)
  }, [])

  return (
    <div ref={ref}>
      <NewVotingRoomModal
        theme={theme}
        availableAmount={tokenBalance}
        setShowModal={setShowNewVoteModal}
        showModal={showNewVoteModal}
        wakuVoting={wakuVoting}
      />
      {showConnectionModal && (
        <Modal heading="Connect" setShowModal={setShowConnectionModal} theme={theme}>
          <Networks />
        </Modal>
      )}
      {votesLength === 0 ? (
        <VotingRoomListEmpty
          account={account}
          theme={theme}
          onConnectClick={onConnectClick}
          onCreateClick={onCreateClick}
        />
      ) : (
        <VotingRoomListHeader
          account={account}
          theme={theme}
          onConnectClick={onConnectClick}
          onCreateClick={onCreateClick}
        />
      )}
    </div>
  )
}

type VotingProps = {
  wakuVoting: WakuVoting
  account: string | null | undefined
}

export function Voting({ wakuVoting, account }: VotingProps) {
  const votes = useVotingRoomsId(wakuVoting)
  const tokenBalance = useTokenBalance(account, wakuVoting)
  const history = useHistory()
  return (
    <Wrapper>
      <VotingListHeader
        votesLength={votes.length}
        tokenBalance={tokenBalance}
        theme={blueTheme}
        account={account}
        wakuVoting={wakuVoting}
      />
      {votes.length > 0 && (
        <VotingRoomList
          account={account}
          theme={blueTheme}
          wakuVoting={wakuVoting}
          votes={votes}
          availableAmount={tokenBalance}
          mobileOnClick={(votingRoom: VotingRoom) => history.push(`/votingRoom/${votingRoom.id.toString()}`)}
        />
      )}
    </Wrapper>
  )
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 1000px;
  margin: 0 auto;
  padding: 150px 32px 50px;
  width: 100%;
  min-height: 100vh;

  @media (max-width: 600px) {
    padding: 132px 16px 32px;
  }

  @media (max-width: 425px) {
    padding: 64px 16px 84px;
  }
`

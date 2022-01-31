import React, { useCallback, useState } from 'react'
import styled from 'styled-components'
import {
  VotingRoomListHeader,
  VotingRoomList,
  NewVotingRoomModal,
} from '@waku/vote-sdk-react-components'
import { blueTheme } from '@waku/vote-poll-sdk-react-components/dist/esm/src/style/themes'
import { WakuVoting } from '@waku/vote-poll-sdk-core'
import { useVotingRoomsId } from '@waku/vote-sdk-react-hooks'
import { useTokenBalance } from '@waku/vote-poll-sdk-react-components'

const THEME = blueTheme;

type VotingProps = {
  wakuVoting: WakuVoting
  account: string | null | undefined
  activate: () => void
}

export function Voting({ wakuVoting, account, activate }: VotingProps) {
  const [showNewVoteModal, setShowNewVoteModal] = useState(false)
  const onCreateClick = useCallback(() => {
    setShowNewVoteModal(true)
  }, [])

  const votes = useVotingRoomsId(wakuVoting)
  const tokenBalance = useTokenBalance(account, wakuVoting)

  return (
    <Wrapper>
      <NewVotingRoomModal
        theme={THEME}
        availableAmount={tokenBalance}
        setShowModal={setShowNewVoteModal}
        showModal={showNewVoteModal}
        wakuVoting={wakuVoting}
      />
      <VotingRoomListHeader
        account={account}
        theme={THEME}
        onConnectClick={activate}
        onCreateClick={onCreateClick}
      />
        <VotingRoomList
          account={account}
          theme={THEME}
          wakuVoting={wakuVoting}
          votes={votes}
          availableAmount={tokenBalance}
        />
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

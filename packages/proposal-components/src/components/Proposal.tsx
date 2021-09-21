import React, { useCallback, useRef, useState } from 'react'
import styled from 'styled-components'
import { ProposalHeader } from './ProposalHeader'
import { blueTheme } from '@status-waku-voting/react-components/dist/esm/src/style/themes'
import { ProposalList } from './ProposalList'
import { WakuVoting } from '@status-waku-voting/core'
import { VotingEmpty } from './VotingEmpty'
import { useTokenBalance } from '@status-waku-voting/react-components'
import { NewVoteModal } from './newVoteModal/NewVoteModal'
import { useEthers } from '@usedapp/core'
import { Modal, Networks, useMobileVersion, Theme } from '@status-waku-voting/react-components'
import { useHistory } from 'react-router'
import { useVotingRoomsId } from '@status-waku-voting/proposal-hooks'

type ProposalListHeaderProps = {
  votesLength: number
  theme: Theme
  wakuVoting: WakuVoting
  tokenBalance: number
  account: string | null | undefined
}

function ProposalListHeader({ votesLength, theme, wakuVoting, tokenBalance, account }: ProposalListHeaderProps) {
  const [showNewVoteModal, setShowNewVoteModal] = useState(false)
  const [showConnectionModal, setShowConnectionModal] = useState(false)
  const { activateBrowserWallet } = useEthers()
  const history = useHistory()
  const ref = useRef<HTMLHeadingElement>(null)
  const mobileVersion = useMobileVersion(ref, 600)

  const onCreateClick = useCallback(() => {
    mobileVersion ? history.push(`/creation`) : setShowNewVoteModal(true)
  }, [mobileVersion])

  const onConnectClick = useCallback(() => {
    if ((window as any).ethereum) {
      activateBrowserWallet()
    } else setShowConnectionModal(true)
  }, [])

  return (
    <div ref={ref}>
      <NewVoteModal
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
        <VotingEmpty account={account} theme={theme} onConnectClick={onConnectClick} onCreateClick={onCreateClick} />
      ) : (
        <ProposalHeader account={account} theme={theme} onConnectClick={onConnectClick} onCreateClick={onCreateClick} />
      )}
    </div>
  )
}

type ProposalProps = {
  wakuVoting: WakuVoting
  account: string | null | undefined
}

export function Proposal({ wakuVoting, account }: ProposalProps) {
  const votes = useVotingRoomsId(wakuVoting)
  const tokenBalance = useTokenBalance(account, wakuVoting)

  return (
    <ProposalWrapper>
      <ProposalVotesWrapper>
        <ProposalListHeader
          votesLength={votes.length}
          tokenBalance={tokenBalance}
          theme={blueTheme}
          account={account}
          wakuVoting={wakuVoting}
        />
        {votes.length > 0 && (
          <ProposalList
            account={account}
            theme={blueTheme}
            wakuVoting={wakuVoting}
            votes={votes}
            availableAmount={tokenBalance}
          />
        )}
      </ProposalVotesWrapper>

      {/* <NotificationItem text={'Proposal you finalized will be settled after 10 confirmations.'} address={'#'} /> */}
    </ProposalWrapper>
  )
}

const ProposalWrapper = styled.div`
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

export const ProposalVotesWrapper = styled(ProposalWrapper)`
  width: 100%;
  padding: 0;
`

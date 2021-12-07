import React, { useMemo, useRef } from 'react'
import CountUp from 'react-countup'
import styled from 'styled-components'
import { addCommas } from '../../helpers/addCommas'
import { formatTimeLeft } from '../../helpers/fomatTimeLeft'
import { VoteGraphBar } from './VoteGraphBar'
import crossIcon from '../../assets/svg/cross.svg'
import crossWinnerIcon from '../../assets/svg/crossWinner.svg'
import checkIcon from '../../assets/svg/check.svg'
import checkWinnerIcon from '../../assets/svg/checkWinner.svg'
import { useMobileVersion } from '@dappconnect/vote-poll-sdk-react-components'
import { VotingRoom } from '@dappconnect/vote-poll-sdk-core/dist/esm/src/types/PollType'
import { WakuVoting } from '@dappconnect/vote-poll-sdk-core'

export interface VoteChartProps {
  votingRoom: VotingRoom
  wakuVoting: WakuVoting
  className: string
  proposingAmount?: number
  selectedVote?: number
  isAnimation?: boolean
  tabletMode?: (val: boolean) => void
}

export function VoteChart({
  votingRoom,
  wakuVoting,
  proposingAmount,
  selectedVote,
  isAnimation,
  tabletMode,
  className,
}: VoteChartProps) {
  const totalVotesFor = useMemo(() => votingRoom.wakuTotalVotesFor, [votingRoom, proposingAmount])

  const totalVotesAgainst = useMemo(() => votingRoom.wakuTotalVotesAgainst, [votingRoom, proposingAmount])

  const voteSum = useMemo(
    () => totalVotesFor.add(totalVotesAgainst),
    [totalVotesFor.toString(), totalVotesAgainst.toString()]
  )
  const graphWidth = useMemo(() => totalVotesAgainst.mul(100).div(voteSum).toNumber(), [voteSum])

  const balanceWidth = useMemo(() => {
    if (!proposingAmount) {
      return graphWidth
    } else {
      const divider = voteSum.add(proposingAmount)
      return selectedVote === 0
        ? totalVotesAgainst.add(proposingAmount).mul(100).div(divider).toNumber()
        : totalVotesAgainst.mul(100).div(divider).toNumber()
    }
  }, [graphWidth, voteSum, proposingAmount])

  const voteWinner = useMemo(() => votingRoom.voteWinner, [votingRoom.voteWinner])
  return (
    <Votes className={className}>
      <VotesChart className={selectedVote || tabletMode ? '' : `notModal ${className}`}>
        <VoteBox
          voteType={2}
          className={className}
          mobileVersion={className === 'mobile'}
          totalVotes={totalVotesAgainst.toNumber()}
          won={voteWinner === 2}
          selected={isAnimation && selectedVote === 0}
          proposingAmount={proposingAmount}
          wakuVoting={wakuVoting}
        />
        {!voteWinner && (
          <TimeLeft className={selectedVote ? '' : `notModal ${className}`}>
            {formatTimeLeft(votingRoom.timeLeft)}
          </TimeLeft>
        )}
        <VoteBox
          voteType={1}
          className={className}
          mobileVersion={className === 'mobile'}
          totalVotes={totalVotesFor.toNumber()}
          won={voteWinner === 1}
          selected={isAnimation && selectedVote === 1}
          proposingAmount={proposingAmount}
          wakuVoting={wakuVoting}
        />
      </VotesChart>
      <VoteGraphBarWrap className={selectedVote || tabletMode ? '' : `notModal ${className}`}>
        <VoteGraphBar
          graphWidth={graphWidth}
          balanceWidth={balanceWidth}
          voteWinner={voteWinner}
          isAnimation={isAnimation}
        />
        <TimeLeftMobile className={selectedVote ? '' : `notModal ${className}`}>
          {formatTimeLeft(votingRoom.timeLeft)}
        </TimeLeftMobile>
      </VoteGraphBarWrap>
    </Votes>
  )
}

type VoteBoxProps = {
  won: boolean
  mobileVersion: boolean
  voteType: number
  totalVotes: number
  wakuVoting: WakuVoting
  className: string
  selected?: boolean
  proposingAmount?: number
}

function VoteBox({
  won,
  mobileVersion,
  className,
  voteType,
  totalVotes,
  proposingAmount,
  selected,
  wakuVoting,
}: VoteBoxProps) {
  return (
    <VoteBoxWrapper
      className={className}
      style={{
        filter: won ? 'grayscale(1)' : 'none',
        alignItems: mobileVersion ? (voteType == 1 ? 'flex-end' : 'flex-start') : 'center',
      }}
    >
      <VoteIcon
        src={voteType === 1 ? (!won ? checkWinnerIcon : checkIcon) : !won ? crossWinnerIcon : crossIcon}
        width={!won ? '18px' : '14px'}
        style={{
          marginLeft: mobileVersion ? '10px' : '0',
        }}
      />
      <span>
        {' '}
        {proposingAmount && selected ? (
          <CountUp end={totalVotes + proposingAmount} separator="," start={totalVotes} duration={2} useEasing={false} />
        ) : (
          addCommas(totalVotes)
        )}{' '}
        <span style={{ fontWeight: 'normal' }}>{wakuVoting.tokenSymbol}</span>
      </span>
    </VoteBoxWrapper>
  )
}

const Votes = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 32px;
  width: 100%;
  position: relative;

  &.tablet {
    margin-bottom: 24px;
  }

  &.mobile {
    margin-bottom: 0;
  }
`
const VotesChart = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: stretch;
  position: relative;
  margin-bottom: 13px;

  &.notModal {
    &.tablet {
      margin-bottom: 0;
    }
  }
`

const VoteBoxWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-content: center;
  font-size: 12px;
  text-align: center;
  font-weight: normal;

  & > span {
    font-weight: bold;
  }

  &.tablet {
    min-width: 70px;
  }

  &.mobile {
    min-width: unset;
  }
`
const VoteIcon = styled.img`
  margin-bottom: 13px;
`
const TimeLeft = styled.div`
  position: absolute;
  top: 50%;
  left: calc(50%);
  transform: translateX(-50%);
  font-size: 12px;
  line-height: 16px;
  letter-spacing: 0.1px;
  color: #939ba1;

  &.notModal {
    &.tablet {
      top: -27px;
    }

    &.mobile {
      top: -27px;
      display: none;
    }
  }
`

const TimeLeftMobile = styled.div`
  position: absolute;
  bottom: -23px;
  left: calc(50%);
  transform: translateX(-50%);
  font-size: 0;
  line-height: 16px;
  letter-spacing: 0.1px;
  color: #939ba1;

  @media (max-width: 375px) {
    bottom: unset;
    top: -23px;
  }

  &.mobile {
    font-size: 12px;
  }
`

const VoteGraphBarWrap = styled.div`
  position: static;
  display: flex;
  justify-content: center;

  &.notModal {
    &.tablet {
      position: absolute;
      width: 65%;
      top: 4px;
      left: 50%;
      transform: translateX(-50%);
    }

    &.mobile {
      position: absolute;
      top: 4px;
      left: 50%;
      transform: translateX(-50%);
      width: 70%;
    }
  }
`

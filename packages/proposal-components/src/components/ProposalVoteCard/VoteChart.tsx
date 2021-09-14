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
import { useMobileVersion } from '@status-waku-voting/react-components'
import { VotingRoom } from '@status-waku-voting/core/dist/esm/src/types/PollType'

export interface VoteChartProps {
  votingRoom: VotingRoom
  proposingAmount?: number
  selectedVote?: number
  isAnimation?: boolean
  tabletMode?: (val: boolean) => void
}

export function VoteChart({ votingRoom, proposingAmount, selectedVote, isAnimation, tabletMode }: VoteChartProps) {
  const ref = useRef<HTMLHeadingElement>(null)
  const mobileVersion = useMobileVersion(ref, 600)

  const voteSum = useMemo(
    () => votingRoom.totalVotesFor.add(votingRoom.totalVotesAgainst),
    [votingRoom.totalVotesFor.toString(), votingRoom.totalVotesAgainst.toString()]
  )
  const graphWidth = useMemo(() => votingRoom.totalVotesAgainst.mul(100).div(voteSum).toNumber(), [voteSum])

  const balanceWidth = useMemo(() => {
    if (!proposingAmount) {
      return graphWidth
    } else {
      const divider = voteSum.add(proposingAmount)
      return selectedVote === 0
        ? votingRoom.totalVotesAgainst.add(proposingAmount).mul(100).div(divider).toNumber()
        : votingRoom.totalVotesAgainst.mul(100).div(divider).toNumber()
    }
  }, [graphWidth, voteSum, proposingAmount])

  const timeLeft = useMemo(() => votingRoom.timeLeft, [votingRoom.timeLeft])
  const voteWinner = useMemo(() => votingRoom.voteWinner, [votingRoom.voteWinner])
  return (
    <Votes ref={ref}>
      <VotesChart className={selectedVote || tabletMode ? '' : 'notModal'}>
        <VoteBox
          style={{
            filter: voteWinner && voteWinner === 2 ? 'grayscale(1)' : 'none',
            alignItems: mobileVersion ? 'flex-start' : 'center',
          }}
        >
          <VoteIcon
            src={voteWinner === 1 ? crossWinnerIcon : crossIcon}
            width={voteWinner === 1 ? '18px' : '14px'}
            style={{
              marginLeft: mobileVersion ? '10px' : '0',
            }}
          />
          <span>
            {' '}
            {isAnimation && proposingAmount && selectedVote && selectedVote === 0 ? (
              <CountUp end={votingRoom.totalVotesAgainst.toNumber() + proposingAmount} separator="," />
            ) : (
              addCommas(votingRoom.totalVotesAgainst.toNumber())
            )}{' '}
            <span style={{ fontWeight: 'normal' }}>ABC</span>
          </span>
        </VoteBox>
        {!voteWinner && <TimeLeft className={selectedVote ? '' : 'notModal'}>{formatTimeLeft(timeLeft)}</TimeLeft>}
        <VoteBox
          style={{
            filter: voteWinner && voteWinner === 1 ? 'grayscale(1)' : 'none',
            alignItems: mobileVersion ? 'flex-end' : 'center',
          }}
        >
          <VoteIcon
            src={voteWinner === 2 ? checkWinnerIcon : checkIcon}
            width={voteWinner === 2 ? '24px' : '18px'}
            style={{
              marginRight: mobileVersion ? '10px' : '0',
            }}
          />
          <span>
            {' '}
            {isAnimation && proposingAmount && selectedVote && selectedVote === 1 ? (
              <CountUp end={votingRoom.totalVotesFor.toNumber() + proposingAmount} separator="," />
            ) : (
              addCommas(votingRoom.totalVotesFor.toNumber())
            )}{' '}
            <span style={{ fontWeight: 'normal' }}>ABC</span>
          </span>
        </VoteBox>
      </VotesChart>
      <VoteGraphBarWrap className={selectedVote || tabletMode ? '' : 'notModal'}>
        <VoteGraphBar
          graphWidth={graphWidth}
          balanceWidth={balanceWidth}
          voteWinner={voteWinner}
          isAnimation={isAnimation}
        />
        <TimeLeftMobile className={selectedVote ? '' : 'notModal'}>{formatTimeLeft(timeLeft)}</TimeLeftMobile>
      </VoteGraphBarWrap>
    </Votes>
  )
}

const Votes = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 32px;
  width: 100%;
  position: relative;

  @media (max-width: 768px) {
    margin-bottom: 24px;
  }

  @media (max-width: 600px) {
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
    @media (max-width: 768px) {
      margin-bottom: 0;
    }
  }
`

const VoteBox = styled.div`
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

  @media (max-width: 768px) {
    min-width: 70px;
  }

  @media (max-width: 600px) {
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
    @media (max-width: 768px) {
      top: -27px;
    }

    @media (max-width: 600px) {
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

  @media (max-width: 600px) {
    font-size: 12px;
  }
`

const VoteGraphBarWrap = styled.div`
  position: static;
  display: flex;
  justify-content: center;

  &.notModal {
    @media (max-width: 768px) {
      position: absolute;
      width: 65%;
      top: 4px;
      left: 50%;
      transform: translateX(-50%);
    }

    @media (max-width: 600px) {
      width: 70%;
    }
  }
`

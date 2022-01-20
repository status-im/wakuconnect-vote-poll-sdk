import { WakuVoting } from '@waku/vote-poll-sdk-core'
import React, { useMemo } from 'react'
import { useState } from 'react'
import styled from 'styled-components'
import { addCommas } from '../helpers/addCommas'
import { Input } from './Input'

export interface VoteProposingProps {
  availableAmount: number
  setProposingAmount: (show: number) => void
  proposingAmount: number
  wakuVoting: WakuVoting
}

export function VotePropose({ availableAmount, proposingAmount, setProposingAmount, wakuVoting }: VoteProposingProps) {
  const [inputFocused, setInputFocused] = useState(false)
  const step = useMemo(
    () => (availableAmount < 100 ? 1 : 10 ** (Math.floor(Math.log10(availableAmount)) - 2)),
    [availableAmount]
  )
  const progress = useMemo(() => (proposingAmount / availableAmount) * 100 + '%', [proposingAmount, availableAmount])

  const sliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (Number(e.target.value) == step * Math.floor(availableAmount / step)) {
      setProposingAmount(availableAmount)
    } else {
      setProposingAmount(Number(e.target.value))
    }
  }

  const onInputAmountBlur = () => {
    setInputFocused(false)
    if (proposingAmount > availableAmount) {
      setProposingAmount(availableAmount)
    }
  }

  return (
    <VoteProposing>
      <VoteProposingInfo>
        <p>My vote</p>
        <span>
          Available {addCommas(availableAmount)} {wakuVoting.tokenSymbol}
        </span>
      </VoteProposingInfo>
      <VoteProposingAmount
        value={inputFocused ? proposingAmount.toString() : addCommas(proposingAmount) + ` ${wakuVoting.tokenSymbol}`}
        onInput={(e) => {
          setProposingAmount(Number(e.currentTarget.value))
        }}
        onBlur={onInputAmountBlur}
        onFocus={() => setInputFocused(true)}
      />
      <VoteProposingRangeWrap>
        <VoteProposingRange
          type="range"
          min={0}
          max={availableAmount}
          step={step}
          value={proposingAmount}
          onChange={sliderChange}
          style={{
            background:
              availableAmount === 0
                ? '#EDF1FF'
                : `linear-gradient(90deg, #0F3595 0% ${progress},  #EDF1FF ${progress} 100%)`,
          }}
        />
      </VoteProposingRangeWrap>
    </VoteProposing>
  )
}

const VoteProposing = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`
const VoteProposingInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 10px;

  & > span {
    font-size: 12px;
    line-height: 16px;
    color: #939ba1;
  }
`

const VoteProposingAmount = styled(Input)`
  width: 100%;
  margin-bottom: 16px;
  font-size: 15px;
  line-height: 22px;
`

const VoteProposingRangeWrap = styled.div`
  width: 294px;
`

const VoteProposingRange = styled.input`
  appearance: none;
  width: 100%;
  height: 4px;
  padding: 0;
  margin: 10px 0;
  border-radius: 2px;
  outline: none;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #5d7be2;
    cursor: pointer;
  }

  &::-moz-range-thumb {
    width: 20px;
    height: 20px;
    background: #5d7be2;
    border: 0.5px solid rgba(0, 0, 0, 0);
    border-radius: 50px;
    cursor: pointer;
  }
`

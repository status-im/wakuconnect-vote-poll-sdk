import { Button } from '@status-waku-voting/react-components'
import styled from 'styled-components'

export const Btn = styled(Button)`
  padding: 11px 0;
  font-weight: 500;
  line-height: 22px;
  text-align: center;
`

export const VoteBtn = styled(Btn)`
  width: 44%;
  padding: 11px 0;
  font-weight: 500;
  line-height: 22px;
  text-align: center;

  &:disabled {
    background: #f3f3f3;
    color: #939ba1;
  }

  @media (max-width: 768px) {
    width: 48%;
  }
`

export const VoteBtnAgainst = styled(VoteBtn)`
  background-color: #ffeded;
  color: #c90a0a;

  &:not(:disabled):hover {
    background: #ffdada;
  }

  &:not(:disabled):active {
    background: #fff5f5;
  }
`
export const VoteBtnFor = styled(VoteBtn)`
  background-color: #edfff4;
  color: #1d920a;

  &:not(:disabled):hover {
    background: #ccfee0;
  }

  &:not(:disabled):active {
    background: #F3FFF8;
`
export const VoteSendingBtn = styled(Btn)`
  padding: 0;
  color: #0f3595;
  height: auto;
  background: transparent;

  &:hover {
    color: #5d7be2;
  }

  &:active {
    color: #0f3595;
  }

  &:disabled {
    color: #676868;
  }
`

export const FinalBtn = styled(Btn)`
  width: 100%;
  background: #edf1ff;
  color: #0f3595;

  &:not(:disabled):hover {
    background: #dbeeff;
  }

  &:not(:disabled):active {
    background: #f7f9ff;
  }

  &:disabled {
    background: #f3f3f3;
    color: #939ba1;
  }

  @media (max-width: 600px) {
    margin-top: 32px;
  }
`

export const ProposingBtn = styled(Btn)`
  width: 100%;
  background-color: #5d7be2;
  color: #ffffff;
  font-weight: bold;
  font-size: 15px;
  line-height: 24px;

  &:not(:disabled):hover {
    background: #0f3595;
  }
  &:not(:disabled):active {
    background: #7e98f4;
  }

  &:disabled {
    background: #888888;
    filter: grayscale(1);
  }
`

import { BigNumber } from 'ethers'

export enum PollType {
  WEIGHTED = 0,
  NON_WEIGHTED = 1,
}

export type PollInitMsg = {
  owner: string
  timestamp: number
  question: string
  answers: string[]
  pollType: PollType
  minToken?: BigNumber
  endTime: number
  signature: string
}

import { BigNumber } from 'ethers'
import { VoteMsg } from '../models/VoteMsg'

export enum PollType {
  WEIGHTED = 0,
  NON_WEIGHTED = 1,
}

export type VotingRoom = {
  startBlock: BigNumber
  endAt: BigNumber
  question: string
  description: string
  totalVotesFor: BigNumber
  totalVotesAgainst: BigNumber
  wakuTotalVotesFor: BigNumber
  wakuTotalVotesAgainst: BigNumber
  wakuVotes?: {
    sum: BigNumber
    votes: VoteMsg[]
  }
  voters: string[]
  id: number
  timeLeft: number
  voteWinner: number | undefined
  transactionHash?: string
}

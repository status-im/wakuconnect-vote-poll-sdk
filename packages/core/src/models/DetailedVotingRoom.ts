import { BigNumber } from 'ethers'
import { VotingRoom } from '../types/PollType'
import { VoteMsg } from './VoteMsg'

export class DetailedVotingRoom {
  public messages: VoteMsg[] = []
  public votingRoom: VotingRoom
  public sum: BigNumber = BigNumber.from(0)

  constructor(votingRoom: VotingRoom, voteMessages: VoteMsg[]) {
    this.votingRoom = votingRoom
    this.sum = voteMessages.reduce((prev, curr) => prev.add(curr.tokenAmount), BigNumber.from(0))
    const votersHashMap: { [voter: string]: boolean } = {}
    votingRoom.voters.forEach((voter) => (votersHashMap[voter] = true))

    voteMessages.forEach((vote) => {
      if (!votersHashMap[vote.voter]) {
        votersHashMap[vote.voter] = true
        this.messages.push(vote)
      }
    })
  }
}

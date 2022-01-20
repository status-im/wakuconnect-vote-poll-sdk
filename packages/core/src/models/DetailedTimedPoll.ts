import { BigNumber } from 'ethers'
import { PollType } from '../types/PollType'
import { PollInitMsg } from './PollInitMsg'
import { TimedPollVoteMsg } from './TimedPollVoteMsg'

export type TimedPollAnswer = {
  text: string
  votes: BigNumber
}

export class DetailedTimedPoll {
  public answers: TimedPollAnswer[]
  public poll: PollInitMsg
  public votesMessages: TimedPollVoteMsg[]
  public numberOfVotes: BigNumber = BigNumber.from(0)

  constructor(poll: PollInitMsg, answers: TimedPollVoteMsg[], tokenDecimals: BigNumber) {
    this.poll = poll
    const summedAnswers = poll.answers.map((answer) => {
      return { text: answer, votes: BigNumber.from(0) }
    })
    const filteredAnswers: TimedPollVoteMsg[] = []
    answers
      .sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1))
      .forEach((answer) => {
        if (filteredAnswers.findIndex((val) => val.voter === answer.voter) === -1) {
          if (poll.pollType === PollType.WEIGHTED && answer.tokenAmount) {
            filteredAnswers.push(answer)
            summedAnswers[answer.answer].votes = summedAnswers[answer.answer].votes.add(
              answer.tokenAmount.div(tokenDecimals)
            )
            this.numberOfVotes = this.numberOfVotes.add(answer.tokenAmount.div(tokenDecimals))
          }
          if (poll.pollType === PollType.NON_WEIGHTED) {
            filteredAnswers.push(answer)
            summedAnswers[answer.answer].votes = summedAnswers[answer.answer].votes.add(1)
            this.numberOfVotes = this.numberOfVotes.add(1)
          }
        }
      })
    this.votesMessages = filteredAnswers
    this.answers = summedAnswers
  }
}

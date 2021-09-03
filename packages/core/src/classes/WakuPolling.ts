import { Waku } from 'js-waku'
import { JsonRpcSigner } from '@ethersproject/providers'
import { PollInitMsg } from '../models/PollInitMsg'
import { PollType } from '../types/PollType'
import { BigNumber, Wallet } from 'ethers'
import { WakuMessage } from 'js-waku'
import { TimedPollVoteMsg } from '../models/TimedPollVoteMsg'
import { DetailedTimedPoll } from '../models/DetailedTimedPoll'
import { createWaku } from '../utils/createWaku'
import { WakuVoting } from './WakuVoting'

export class WakuPolling extends WakuVoting {
  protected constructor(appName: string, tokenAddress: string, waku: Waku) {
    super(appName, tokenAddress, waku)
    this.wakuMessages['pollInit'] = {
      topic: `/${this.appName}/waku-polling/timed-polls-init/proto/`,
      hashMap: {},
      arr: [],
      updateFunction: (msg: WakuMessage[]) =>
        this.decodeMsgAndSetArray(
          msg,
          PollInitMsg.decode,
          this.wakuMessages['pollInit'],
          (e) => e.endTime > Date.now()
        ),
    }
    this.wakuMessages['pollVote'] = {
      topic: `/${this.appName}/waku-polling/votes/proto/`,
      hashMap: {},
      arr: [],
      updateFunction: (msg: WakuMessage[]) =>
        this.decodeMsgAndSetArray(msg, TimedPollVoteMsg.decode, this.wakuMessages['pollVote']),
    }
    this.setObserver()
  }

  public static async create(appName: string, tokenAddress: string, waku?: Waku) {
    const wakuPolling = new WakuPolling(appName, tokenAddress, await createWaku(waku))
    return wakuPolling
  }

  public async createTimedPoll(
    signer: JsonRpcSigner | Wallet,
    question: string,
    answers: string[],
    pollType: PollType,
    minToken?: BigNumber,
    endTime?: number
  ) {
    const pollInit = await PollInitMsg.create(signer, question, answers, pollType, minToken, endTime)
    await this.sendWakuMessage(this.wakuMessages['pollInit'], pollInit)
  }

  public async sendTimedPollVote(
    signer: JsonRpcSigner | Wallet,
    pollId: string,
    selectedAnswer: number,
    tokenAmount?: BigNumber
  ) {
    const pollVote = await TimedPollVoteMsg.create(signer, pollId, selectedAnswer, tokenAmount)
    await this.sendWakuMessage(this.wakuMessages['pollVote'], pollVote)
  }

  public async getDetailedTimedPolls() {
    return this.wakuMessages['pollInit'].arr.map(
      (poll) =>
        new DetailedTimedPoll(
          poll,
          this.wakuMessages['pollVote'].arr.filter((vote) => vote.pollId === poll.id)
        )
    )
  }
}

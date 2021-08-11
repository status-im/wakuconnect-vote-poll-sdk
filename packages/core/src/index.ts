import { Waku, getStatusFleetNodes } from 'js-waku'
import { JsonRpcSigner } from '@ethersproject/providers'
import { PollInitMsg } from './models/PollInitMsg'
import { PollType } from './types/PollType'
import { BigNumber, Wallet } from 'ethers'
import PollInit from './utils/proto/PollInit'
import { WakuMessage } from 'js-waku'
import { TimedPollVoteMsg } from './models/TimedPollVoteMsg'
import TimedPollVote from './utils/proto/TimedPollVote'
import { DetailedTimedPoll } from './models/DetailedTimedPoll'

class WakuVoting {
  private appName: string
  private waku: Waku | undefined
  public tokenAddress: string
  private pollInitTopic: string
  private timedPollVoteTopic: string
  private static async createWaku() {
    const waku = await Waku.create()
    const nodes = await getStatusFleetNodes()
    await Promise.all(
      nodes.map((addr) => {
        if (waku) {
          return waku.dial(addr)
        }
      })
    )
    return waku
  }

  private constructor(appName: string, tokenAddress: string, waku: Waku) {
    this.appName = appName
    this.tokenAddress = tokenAddress
    this.pollInitTopic = `/${this.appName}/waku-polling/timed-polls-init/proto/`
    this.timedPollVoteTopic = `/${this.appName}/waku-polling/votes/proto/`
    this.waku = waku
  }

  public static async create(appName: string, tokenAddress: string, waku?: Waku) {
    if (!waku) {
      waku = await this.createWaku()
    }
    return new WakuVoting(appName, tokenAddress, waku)
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
    const payload = PollInit.encode(pollInit)
    if (payload && pollInit) {
      const wakuMessage = await WakuMessage.fromBytes(payload, this.pollInitTopic, {
        timestamp: new Date(pollInit.timestamp),
      })
      await this.waku?.relay.send(wakuMessage)
    }
  }

  private async getTimedPolls() {
    const messages = await this.waku?.store.queryHistory({ contentTopics: [this.pollInitTopic] })
    return (
      messages
        ?.filter((e): e is WakuMessage & { payload: Uint8Array } => !!e?.payload)
        .map((msg) => PollInit.decode(msg.payload, msg.timestamp))
        .filter((poll): poll is PollInitMsg => !!poll) ?? []
    )
  }

  public async sendTimedPollVote(
    signer: JsonRpcSigner | Wallet,
    id: string,
    selectedAnswer: number,
    tokenAmount?: BigNumber
  ) {
    const pollVote = await TimedPollVoteMsg.create(signer, id, selectedAnswer, tokenAmount)
    const payload = TimedPollVote.encode(pollVote)
    if (payload && pollVote) {
      const wakuMessage = await WakuMessage.fromBytes(payload, this.timedPollVoteTopic, {
        timestamp: new Date(pollVote.timestamp),
      })
      await this.waku?.relay.send(wakuMessage)
    }
  }

  private async getTimedPollsVotes() {
    const messages = await this.waku?.store.queryHistory({ contentTopics: [this.timedPollVoteTopic] })
    return (
      messages
        ?.filter((e): e is WakuMessage & { payload: Uint8Array } => !!e?.payload)
        .map((msg) => TimedPollVote.decode(msg.payload, msg.timestamp))
        .filter((poll): poll is TimedPollVoteMsg => !!poll) ?? []
    )
  }

  public async getDetailedTimedPolls() {
    const polls = await this.getTimedPolls()
    const votes = await this.getTimedPollsVotes()
    return polls.map(
      (poll) =>
        new DetailedTimedPoll(
          poll,
          votes.filter((vote) => vote.id === poll.id)
        )
    )
  }
}

export default WakuVoting

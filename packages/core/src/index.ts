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
import { isTruthy } from './utils'

function decodeWakuMessages<T>(
  messages: WakuMessage[] | null | undefined,
  decode: (payload: Uint8Array | undefined, timestamp: Date | undefined) => T | undefined
) {
  return messages?.map((msg) => decode(msg.payload, msg.timestamp)).filter(isTruthy) ?? []
}

async function receiveNewWakuMessages(lastTimestamp: number, topic: string, waku: Waku | undefined) {
  const messages = await waku?.store.queryHistory({ contentTopics: [topic] })

  if (messages) {
    messages.sort((a, b) => (a.timestamp && b.timestamp && a.timestamp?.getTime() < b.timestamp?.getTime() ? 1 : -1))
    const lastMessageIndex = messages.findIndex((message) => message.timestamp?.getTime() === lastTimestamp)
    const newMessages = lastMessageIndex === -1 ? messages : messages.slice(0, lastMessageIndex)
    return newMessages
  }
  return []
}

class WakuVoting {
  private appName: string
  private waku: Waku | undefined
  public tokenAddress: string
  private pollInitTopic: string
  private timedPollVoteTopic: string

  private timedPollInitMessages: PollInitMsg[] = []
  private timedPollVotesMessages: TimedPollVoteMsg[] = []

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
    if (pollInit) {
      const payload = PollInit.encode(pollInit)
      if (payload) {
        const wakuMessage = await WakuMessage.fromBytes(payload, this.pollInitTopic, {
          timestamp: new Date(pollInit.timestamp),
        })
        await this.waku?.relay.send(wakuMessage)
      }
    }
  }

  private async getTimedPolls() {
    const lastTimestamp = this.timedPollInitMessages?.[0]?.timestamp ?? 0

    const newMessages = await receiveNewWakuMessages(lastTimestamp, this.pollInitTopic, this.waku)
    const newPollInitMessages = decodeWakuMessages(newMessages, PollInit.decode)
    if (newPollInitMessages.length > 0) {
      this.timedPollInitMessages = [...newPollInitMessages, ...this.timedPollInitMessages]
    }
    return this.timedPollInitMessages
  }

  public async sendTimedPollVote(
    signer: JsonRpcSigner | Wallet,
    id: string,
    selectedAnswer: number,
    tokenAmount?: BigNumber
  ) {
    const pollVote = await TimedPollVoteMsg.create(signer, id, selectedAnswer, tokenAmount)
    if (pollVote) {
      const payload = TimedPollVote.encode(pollVote)
      if (payload) {
        const wakuMessage = await WakuMessage.fromBytes(payload, this.timedPollVoteTopic, {
          timestamp: new Date(pollVote.timestamp),
        })
        await this.waku?.relay.send(wakuMessage)
      }
    }
  }

  private async getTimedPollsVotes() {
    const lastTimestamp = this.timedPollVotesMessages?.[0]?.timestamp ?? 0

    const newMessages = await receiveNewWakuMessages(lastTimestamp, this.timedPollVoteTopic, this.waku)
    const newVoteMessages = decodeWakuMessages(newMessages, TimedPollVote.decode)
    if (newVoteMessages.length > 0) {
      this.timedPollVotesMessages = [...newVoteMessages, ...this.timedPollVotesMessages]
    }
    return this.timedPollVotesMessages
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

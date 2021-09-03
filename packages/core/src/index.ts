import { Waku } from 'js-waku'
import { JsonRpcSigner } from '@ethersproject/providers'
import { PollInitMsg } from './models/PollInitMsg'
import { PollType } from './types/PollType'
import { BigNumber, Wallet } from 'ethers'
import { WakuMessage, StoreCodec } from 'js-waku'
import { TimedPollVoteMsg } from './models/TimedPollVoteMsg'
import { DetailedTimedPoll } from './models/DetailedTimedPoll'
import { isTruthy } from './utils'
import { createWaku } from './utils/createWaku'

type WakuMessageStore = {
  topic: string
  hashMap: { [id: string]: boolean }
  arr: any[]
  updateFunction: (msg: WakuMessage[]) => void
}

type WakuMessageStores = {
  [messageType: string]: WakuMessageStore
}

class WakuVoting {
  protected appName: string
  protected waku: Waku
  public tokenAddress: string

  protected wakuMessages: WakuMessageStores = {}
  protected observers: { callback: (msg: WakuMessage) => void; topics: string[] }[] = []
  protected constructor(appName: string, tokenAddress: string, waku: Waku) {
    this.appName = appName
    this.tokenAddress = tokenAddress
    this.waku = waku
  }

  public static async create(appName: string, tokenAddress: string, waku?: Waku) {
    return new WakuVoting(appName, tokenAddress, await createWaku(waku))
  }

  public cleanUp() {
    this.observers.forEach((observer) => this.waku.relay.deleteObserver(observer.callback, observer.topics))
  }

  protected async setObserver(msgObj: WakuMessageStore) {
    const storeMessages = await this.waku?.store.queryHistory([msgObj.topic])
    if (storeMessages) {
      msgObj.updateFunction(storeMessages)
    }
    this.waku.relay.addObserver((msg) => msgObj.updateFunction([msg]), [msgObj.topic])
    this.observers.push({ callback: (msg) => msgObj.updateFunction([msg]), topics: [msgObj.topic] })
  }

  protected decodeMsgAndSetArray<T extends { id: string; timestamp: number }>(
    messages: WakuMessage[],
    decode: (payload: Uint8Array | undefined, timestamp: Date | undefined) => T | undefined,
    msgObj: WakuMessageStore,
    filterFunction?: (e: T) => boolean
  ) {
    messages
      .map((msg) => decode(msg.payload, msg.timestamp))
      .sort((a, b) => ((a?.timestamp ?? new Date(0)) > (b?.timestamp ?? new Date(0)) ? 1 : -1))
      .forEach((e) => {
        if (e) {
          if (filterFunction ? filterFunction(e) : true && !msgObj.hashMap?.[e.id]) {
            msgObj.arr.unshift(e)
            msgObj.hashMap[e.id] = true
          }
        }
      })
  }

  protected async sendWakuMessage<T extends { encode: () => Uint8Array | undefined; timestamp: number }>(
    msgObj: WakuMessageStore,
    decodedMsg: T | undefined
  ) {
    const payload = decodedMsg?.encode()
    if (payload && decodedMsg) {
      const wakuMessage = await WakuMessage.fromBytes(payload, msgObj.topic, {
        timestamp: new Date(decodedMsg.timestamp),
      })
      await this.waku?.relay.send(wakuMessage)
      msgObj.updateFunction([wakuMessage])
    }
  }
}

class WakuPolling extends WakuVoting {
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
  }

  public static async create(appName: string, tokenAddress: string, waku?: Waku) {
    const wakuPolling = new WakuPolling(appName, tokenAddress, await createWaku(waku))
    wakuPolling.setObserver(wakuPolling.wakuMessages['pollInit'])
    wakuPolling.setObserver(wakuPolling.wakuMessages['pollVote'])
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

export { WakuVoting, WakuPolling }

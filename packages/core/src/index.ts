import { Waku, getStatusFleetNodes } from 'js-waku'
import { JsonRpcSigner } from '@ethersproject/providers'
import { PollInitMsg } from './models/PollInitMsg'
import { PollType } from './types/PollType'
import { BigNumber, Wallet } from 'ethers'
import PollInit from './utils/proto/PollInit'
import { WakuMessage } from 'js-waku'

class WakuVoting {
  private appName: string
  private waku: Waku | undefined
  public tokenAddress: string
  private pollInitTopic: string

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

  public async getTimedPolls() {
    const messages = await this.waku?.store.queryHistory({ contentTopics: [this.pollInitTopic] })
    return messages
      ?.filter((e): e is WakuMessage & { payload: Uint8Array } => !!e?.payload)
      .map((msg) => PollInit.decode(msg.payload, msg.timestamp))
  }
}

export default WakuVoting

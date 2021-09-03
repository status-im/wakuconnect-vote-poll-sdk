import { Waku } from 'js-waku'
import { WakuMessage } from 'js-waku'
import { createWaku } from '../utils/createWaku'
import { Provider } from '@ethersproject/providers'

type WakuMessageStore = {
  topic: string
  hashMap: { [id: string]: boolean }
  arr: any[]
  updateFunction: (msg: WakuMessage[]) => void
}

type WakuMessageStores = {
  [messageType: string]: WakuMessageStore
}

export class WakuVoting {
  protected appName: string
  protected waku: Waku
  public tokenAddress: string
  protected provider: Provider
  protected chainId = 0
  protected wakuMessages: WakuMessageStores = {}
  protected observers: { callback: (msg: WakuMessage) => void; topics: string[] }[] = []
  protected constructor(appName: string, tokenAddress: string, waku: Waku, provider: Provider, chainId: number) {
    this.appName = appName
    this.tokenAddress = tokenAddress
    this.waku = waku
    this.provider = provider
    this.chainId = chainId
  }

  public static async create(appName: string, tokenAddress: string, provider: Provider, waku?: Waku) {
    const network = await provider.getNetwork()
    const wakuVoting = new WakuVoting(appName, tokenAddress, await createWaku(waku), provider, network.chainId)
    return wakuVoting
  }

  public cleanUp() {
    this.observers.forEach((observer) => this.waku.relay.deleteObserver(observer.callback, observer.topics))
    this.wakuMessages = {}
  }

  protected async setObserver() {
    await Promise.all(
      Object.values(this.wakuMessages).map(async (msgObj) => {
        const storeMessages = await this.waku?.store.queryHistory([msgObj.topic])
        if (storeMessages) {
          msgObj.updateFunction(storeMessages)
        }
        this.waku.relay.addObserver((msg) => msgObj.updateFunction([msg]), [msgObj.topic])
        this.observers.push({ callback: (msg) => msgObj.updateFunction([msg]), topics: [msgObj.topic] })
      })
    )
  }

  protected decodeMsgAndSetArray<T extends { id: string; timestamp: number }>(
    messages: WakuMessage[],
    decode: (payload: Uint8Array | undefined, timestamp: Date | undefined, chainId: number) => T | undefined,
    msgObj: WakuMessageStore,
    filterFunction?: (e: T) => boolean
  ) {
    messages
      .map((msg) => decode(msg.payload, msg.timestamp, this.chainId))
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

import { Waku } from 'js-waku'
import { WakuMessage } from 'js-waku'
import { BigNumber } from 'ethers'
import { Web3Provider } from '@ethersproject/providers'
import { Contract } from '@ethersproject/contracts'
import { Interface } from '@ethersproject/abi'
import { ERC20 } from '../abi'
import { createWaku } from '../utils/createWaku'
import { WakuMessagesSetup } from '../types/WakuMessagesSetup'
const ABI = [
  'function aggregate(tuple(address target, bytes callData)[] calls) view returns (uint256 blockNumber, bytes[] returnData)',
]

type WakuMessageStore = {
  topic: string
  hashMap: { [id: string]: boolean }
  tokenCheckArray: string[]
  arr: any[]
  updateFunction: (msg: WakuMessage[]) => void
}

type WakuMessageStores = {
  [messageType: string]: WakuMessageStore
}

export class WakuMessaging {
  protected appName: string
  protected waku: Waku | undefined
  protected token: Contract
  protected provider: Web3Provider
  protected chainId = 0
  protected wakuMessages: WakuMessageStores = {}
  protected observers: { callback: (msg: WakuMessage) => void; topics: string[] }[] = []
  protected multicall: Contract
  public tokenDecimals: number | undefined
  public tokenSymbol: string | undefined

  protected constructor(
    appName: string,
    tokenAddress: string,
    provider: Web3Provider,
    chainId: number,
    multicall: string,
    wakuMessagesSetup: WakuMessagesSetup<any>[],
    waku?: Waku
  ) {
    this.appName = appName
    this.waku = waku
    this.provider = provider
    this.chainId = chainId
    this.token = new Contract(tokenAddress, ERC20, this.provider)
    this.multicall = new Contract(multicall, ABI, this.provider)

    wakuMessagesSetup.forEach((setupData) => {
      this.wakuMessages[setupData.name] = {
        topic: `/${this.appName}/0.1/${setupData.name}/proto/`,
        tokenCheckArray: setupData.tokenCheckArray,
        hashMap: {},
        arr: [],
        updateFunction: (msg) => this.decodeMsgAndSetArray(msg, setupData),
      }
    })
    this.setObserver()
  }

  public cleanUp() {
    this.observers.forEach((observer) => this?.waku?.relay.deleteObserver(observer.callback, observer.topics))
    this.wakuMessages = {}
  }

  protected async setObserver() {
    this.tokenDecimals = await this.token.decimals()
    this.tokenSymbol = await this.token.symbol()
    this.waku = await createWaku(this.waku)
    await Promise.all(
      Object.values(this.wakuMessages).map(async (msgObj) => {
        const storeMessages = await this.waku?.store.queryHistory([msgObj.topic])
        msgObj.updateFunction(storeMessages ?? [])
        this?.waku?.relay.addObserver((msg) => msgObj.updateFunction([msg]), [msgObj.topic])
        this.observers.push({ callback: (msg) => msgObj.updateFunction([msg]), topics: [msgObj.topic] })
      })
    )
  }

  protected decodeMsgAndSetArray<T extends { id: string; timestamp: number }>(
    messages: WakuMessage[],
    setupData: WakuMessagesSetup<T>
  ) {
    const { decodeFunction, filterFunction, name } = setupData
    const { arr, hashMap } = this.wakuMessages[name]
    const decodedMessages = messages.map(decodeFunction).filter((e): e is T => !!e)

    const addressesToUpdate: string[] = []
    decodedMessages.forEach((message: any) => {
      setupData.tokenCheckArray.forEach((property) => {
        addressesToUpdate.push(message?.[property])
      })
    })
    this.updateBalances(addressesToUpdate)

    decodedMessages
      .sort((a, b) => ((a?.timestamp ?? new Date(0)) > (b?.timestamp ?? new Date(0)) ? 1 : -1))
      .forEach((e) => {
        if (e) {
          if (filterFunction ? filterFunction(e) : true) {
            if (!hashMap?.[e.id]) {
              arr.unshift(e)
              hashMap[e.id] = true
            }
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

  protected addressesBalances: { [address: string]: BigNumber | undefined } = {}
  protected lastBlockBalances = 0

  protected async updateBalances(newAddresses?: string[]) {
    const addressesToUpdate: { [addr: string]: boolean } = {}

    const addAddressToUpdate = (addr: string) => {
      if (!addressesToUpdate[addr]) {
        addressesToUpdate[addr] = true
      }
    }

    const currentBlock = await this.provider.getBlockNumber()

    if (this.lastBlockBalances != currentBlock) {
      Object.keys(this.addressesBalances).forEach(addAddressToUpdate)
      newAddresses?.forEach(addAddressToUpdate)
    } else {
      newAddresses?.forEach((newAddress) => {
        if (!this.addressesBalances[newAddress]) addAddressToUpdate(newAddress)
      })
    }

    const addressesToUpdateArray = Object.keys(addressesToUpdate)
    if (addressesToUpdateArray.length > 0) {
      const erc20 = this.token.interface
      const callData = addressesToUpdateArray.map((addr) => {
        return [this.token.address, erc20.encodeFunctionData('balanceOf', [addr])]
      })
      const result = (await this.multicall.aggregate(callData))[1].map((data: any) => {
        try {
          return erc20.decodeFunctionResult('balanceOf', data)
        } catch {
          return undefined
        }
      })

      result.forEach((e: any, idx: number) => {
        this.addressesBalances[addressesToUpdateArray[idx]] = e ? e[0] : undefined
      })
      this.lastBlockBalances = currentBlock
    }
  }

  public async getTokenBalance(address: string) {
    await this.updateBalances([address])
    return this.addressesBalances[address] ?? undefined
  }
}

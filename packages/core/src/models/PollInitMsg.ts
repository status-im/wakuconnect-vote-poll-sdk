import { PollType } from '../types/PollType'
import { BigNumber, utils, Wallet } from 'ethers'
import { JsonRpcSigner } from '@ethersproject/providers'
import { PollInit } from 'protons'

type Message = {
  owner: string
  timestamp: number
  question: string
  answers: string[]
  pollType: PollType
  endTime: number
  minToken: BigNumber | undefined
}

export function createSignMsgParams(message: Message) {
  const msgParams: any = {
    domain: {
      name: 'Waku polling',
      version: '1',
    },
    message: {
      owner: message.owner,
      timestamp: new Date(message.timestamp).toLocaleDateString(),
      question: message.question,
      answers: message.answers,
      pollType: message.pollType === PollType.WEIGHTED ? 'Weighted' : 'Non weighted',
      endTime: new Date(message.endTime).toLocaleDateString(),
    },
    primaryType: 'Mail',
    types: {
      EIP712Domain: [
        { name: 'name', type: 'string' },
        { name: 'version', type: 'string' },
      ],
      Mail: [
        { name: 'owner', type: 'address' },
        { name: 'timestamp', type: 'string' },
        { name: 'question', type: 'string' },
        { name: 'answers', type: 'string[]' },
        { name: 'pollType', type: 'string' },
        { name: 'endTime', type: 'string' },
      ],
    },
  }

  if (message.pollType === PollType.NON_WEIGHTED) {
    if (message.minToken) {
      msgParams.message = { ...msgParams.message, minToken: message.minToken.toString() }
      msgParams.types.Mail.push({ name: 'minToken', type: 'uint256' })
    }
  }
  return msgParams
}

export class PollInitMsg {
  public owner: string
  public timestamp: number
  public question: string
  public answers: string[]
  public pollType: PollType
  public minToken?: BigNumber
  public endTime: number
  public signature: string
  public id: string

  private constructor(
    id: string,
    owner: string,
    signature: string,
    timestamp: number,
    question: string,
    answers: string[],
    pollType: PollType,
    endTime: number,
    minToken?: BigNumber
  ) {
    this.id = id
    this.owner = owner
    this.timestamp = timestamp
    this.question = question
    this.answers = answers
    this.pollType = pollType
    this.minToken = minToken
    this.endTime = endTime

    this.signature = signature
  }

  static async _createWithSignFunction(
    signFunction: (params: string[]) => Promise<string | undefined>,
    signer: JsonRpcSigner | Wallet,
    question: string,
    answers: string[],
    pollType: PollType,
    minToken?: BigNumber,
    endTime?: number
  ): Promise<PollInitMsg | undefined> {
    const owner = await signer.getAddress()
    const timestamp = Date.now()
    let newEndTime = timestamp + 10000000
    if (endTime) {
      newEndTime = endTime
    }

    if (pollType === PollType.NON_WEIGHTED && !minToken) {
      minToken = BigNumber.from(1)
    }

    const params = createSignMsgParams({
      owner,
      timestamp,
      question,
      answers,
      pollType,
      endTime: newEndTime,
      minToken,
    })

    const signature = await signFunction([owner, JSON.stringify(params)])
    if (!signature) {
      return undefined
    }

    const id = utils.solidityKeccak256(['address', 'uint256'], [owner, timestamp])
    return new PollInitMsg(id, owner, signature, timestamp, question, answers, pollType, newEndTime, minToken)
  }

  static async create(
    signer: JsonRpcSigner | Wallet,
    question: string,
    answers: string[],
    pollType: PollType,
    minToken?: BigNumber,
    endTime?: number
  ): Promise<PollInitMsg | undefined> {
    const signFunction = async (params: string[]) => {
      if ('send' in signer.provider) {
        return signer.provider.send('eth_signTypedData_v4', params)
      } else {
        return undefined
      }
    }
    return this._createWithSignFunction(signFunction, signer, question, answers, pollType, minToken, endTime)
  }

  static fromProto(payload: PollInit, recoverFunction: ({ data, sig }: { data: any; sig: string }) => string) {
    const owner = utils.getAddress(utils.hexlify(payload.owner))
    const timestamp = payload.timestamp
    const question = payload.question
    const answers = payload.answers
    const pollType = payload.pollType
    const endTime = payload.endTime
    const signature = utils.hexlify(payload.signature)
    const minToken = payload.minToken ? BigNumber.from(payload.minToken) : undefined

    const params = createSignMsgParams({
      owner,
      timestamp,
      question,
      answers,
      endTime,
      minToken,
      pollType,
    })
    const verifiedAddress = recoverFunction({
      data: params,
      sig: signature,
    })
    if (verifiedAddress != owner) {
      return undefined
    }
    const id = utils.solidityKeccak256(['address', 'uint256'], [owner, timestamp])
    return new PollInitMsg(id, owner, signature, timestamp, question, answers, pollType, endTime, minToken)
  }
}

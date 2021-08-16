import { PollType } from '../types/PollType'
import { BigNumber, utils, Wallet } from 'ethers'
import { JsonRpcSigner } from '@ethersproject/providers'
import { PollInit } from 'protons'
import { createSignedMsg } from '../utils/createSignedMsg'

type Message = {
  owner: string
  timestamp: number
  question: string
  answers: string[]
  pollType: PollType
  endTime: number
  minToken?: BigNumber
}

export function createSignMsgParams(message: Message) {
  const msgParams: any = {
    domain: {
      name: 'Waku polling',
      version: '1',
    },
    message: {
      ...message,
      timestamp: new Date(message.timestamp).toLocaleDateString(),
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

  if (message.pollType === PollType.NON_WEIGHTED && message.minToken) {
    msgParams.message = { ...msgParams.message, minToken: message.minToken.toString() }
    msgParams.types.Mail.push({ name: 'minToken', type: 'uint256' })
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

  constructor(signature: string, msg: Message) {
    this.id = utils.id([msg.owner, msg.timestamp, signature].join())
    this.signature = signature
    this.owner = msg.owner
    this.timestamp = msg.timestamp
    this.question = msg.question
    this.answers = msg.answers
    this.pollType = msg.pollType
    this.minToken = msg.minToken
    this.endTime = msg.endTime
  }

  static async _createWithSignFunction(
    signFunction: (
      msg: any,
      params: string[],
      Class: new (sig: string, msg: any) => PollInitMsg
    ) => Promise<PollInitMsg | undefined>,
    signer: JsonRpcSigner | Wallet,
    question: string,
    answers: string[],
    pollType: PollType,
    minToken?: BigNumber,
    endTime?: number
  ): Promise<PollInitMsg | undefined> {
    const timestamp = Date.now()
    if (pollType === PollType.NON_WEIGHTED && !minToken) {
      minToken = BigNumber.from(1)
    }
    const msg = {
      owner: await signer.getAddress(),
      timestamp,
      question,
      answers,
      pollType,
      endTime: endTime ? endTime : timestamp + 100000000,
      minToken,
    }
    const params = [msg.owner, JSON.stringify(createSignMsgParams(msg))]
    return signFunction(msg, params, PollInitMsg)
  }

  static async create(
    signer: JsonRpcSigner | Wallet,
    question: string,
    answers: string[],
    pollType: PollType,
    minToken?: BigNumber,
    endTime?: number
  ): Promise<PollInitMsg | undefined> {
    return this._createWithSignFunction(createSignedMsg(signer), signer, question, answers, pollType, minToken, endTime)
  }

  static fromProto(payload: PollInit, recoverFunction: ({ data, sig }: { data: any; sig: string }) => string) {
    const signature = utils.hexlify(payload.signature)

    const msg = {
      ...payload,
      owner: utils.getAddress(utils.hexlify(payload.owner)),
      minToken: payload.minToken ? BigNumber.from(payload.minToken) : undefined,
    }

    const params = createSignMsgParams(msg)
    const verifiedAddress = recoverFunction({
      data: params,
      sig: signature,
    })
    if (verifiedAddress != msg.owner) {
      return undefined
    }

    return new PollInitMsg(signature, msg)
  }
}

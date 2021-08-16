import { BigNumber, utils } from 'ethers'
import { JsonRpcSigner } from '@ethersproject/providers'
import { TimedPollVote } from 'protons'
import { Wallet } from 'ethers'
import { createSignedMsg } from '../utils/createSignedMsg'

type Message = {
  id: string
  voter: string
  timestamp: number
  answer: number
  tokenAmount?: BigNumber
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
    },
    primaryType: 'Mail',
    types: {
      EIP712Domain: [
        { name: 'name', type: 'string' },
        { name: 'version', type: 'string' },
      ],
      Mail: [
        { name: 'id', type: 'string' },
        { name: 'voter', type: 'string' },
        { name: 'timestamp', type: 'string' },
        { name: 'answer', type: 'string' },
      ],
    },
  }

  if (message.tokenAmount) {
    msgParams.message = { ...msgParams.message, tokenAmount: message.tokenAmount.toString() }
    msgParams.types.Mail.push({ name: 'tokenAmount', type: 'uint256' })
  }
  return msgParams
}

export class TimedPollVoteMsg {
  public id: string
  public voter: string
  public timestamp: number
  public answer: number
  public tokenAmount?: BigNumber
  public signature: string

  constructor(signature: string, msg: Message) {
    this.id = msg.id
    this.voter = msg.voter
    this.timestamp = msg.timestamp
    this.answer = msg.answer
    this.tokenAmount = msg.tokenAmount

    this.signature = signature
  }

  static async _createWithSignFunction(
    signFunction: (
      msg: any,
      params: string[],
      Class: new (sig: string, msg: any) => TimedPollVoteMsg
    ) => Promise<TimedPollVoteMsg | undefined>,
    signer: JsonRpcSigner | Wallet,
    id: string,
    answer: number,
    tokenAmount?: BigNumber
  ): Promise<TimedPollVoteMsg | undefined> {
    const voter = await signer.getAddress()
    const msg = { id, voter, timestamp: Date.now(), answer, tokenAmount }
    const params = [msg.voter, JSON.stringify(createSignMsgParams(msg))]

    return signFunction(msg, params, TimedPollVoteMsg)
  }
  static async create(
    signer: JsonRpcSigner | Wallet,
    id: string,
    answer: number,
    tokenAmount?: BigNumber
  ): Promise<TimedPollVoteMsg | undefined> {
    return this._createWithSignFunction(createSignedMsg(signer), signer, id, answer, tokenAmount)
  }

  static fromProto(payload: TimedPollVote, recoverFunction: ({ data, sig }: { data: any; sig: string }) => string) {
    const signature = utils.hexlify(payload.signature)

    const msg = {
      id: utils.hexlify(payload.id),
      answer: payload.answer,
      voter: utils.getAddress(utils.hexlify(payload.voter)),
      timestamp: payload.timestamp,
      tokenAmount: payload.tokenAmount ? BigNumber.from(payload.tokenAmount) : undefined,
    }

    const params = createSignMsgParams(msg)
    const verifiedAddress = recoverFunction({
      data: params,
      sig: signature,
    })
    if (verifiedAddress != msg.voter) {
      return undefined
    }

    return new TimedPollVoteMsg(signature, msg)
  }
}

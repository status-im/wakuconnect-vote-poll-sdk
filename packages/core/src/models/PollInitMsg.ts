import { PollType } from '../types/PollType'
import { BigNumber, utils, Wallet } from 'ethers'
import { JsonRpcSigner } from '@ethersproject/providers'
import protons, { PollInit } from 'protons'
import { createSignFunction } from '../utils/createSignFunction'
import { verifySignature } from '../utils/verifySignature'
import { WakuMessage } from 'js-waku'

const proto = protons(`
message PollInit {
    bytes owner = 1; 
    int64 timestamp = 2;
    string question = 3;
    repeated string answers = 4;
    enum PollType {
        WEIGHTED = 0;
        NON_WEIGHTED = 1;
    }
    PollType pollType = 5;
    optional bytes minToken = 6;
    int64 endTime = 7;
    bytes signature = 8;
}
`)

type Message = {
  owner: string
  timestamp: number
  question: string
  answers: string[]
  pollType: PollType
  endTime: number
  minToken?: BigNumber
}

export function createSignMsgParams(message: Message, chainId: number) {
  const msgParams: any = {
    domain: {
      name: 'Waku polling',
      version: '1',
      chainId,
    },
    message: {
      ...message,
      timestamp: new Date(message.timestamp).toLocaleString(),
      pollType: message.pollType === PollType.WEIGHTED ? 'Weighted' : 'Non weighted',
      endTime: new Date(message.endTime).toLocaleString(),
    },
    primaryType: 'Mail',
    types: {
      EIP712Domain: [
        { name: 'name', type: 'string' },
        { name: 'version', type: 'string' },
        { name: 'chainId', type: 'uint256' },
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
  public chainId: number
  constructor(signature: string, msg: Message, chainId: number) {
    this.id = utils.id([msg.owner, msg.timestamp, signature].join())
    this.signature = signature
    this.owner = msg.owner
    this.timestamp = msg.timestamp
    this.question = msg.question
    this.answers = msg.answers
    this.pollType = msg.pollType
    this.minToken = msg.minToken
    this.endTime = msg.endTime
    this.chainId = chainId
  }

  static async _createWithSignFunction(
    signFunction: (params: string[]) => Promise<string | undefined>,
    signer: JsonRpcSigner | Wallet,
    question: string,
    answers: string[],
    pollType: PollType,
    chainId: number,
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
    const params = [msg.owner, JSON.stringify(createSignMsgParams(msg, chainId))]
    const signature = await signFunction(params)
    if (signature) {
      return new PollInitMsg(signature, msg, chainId)
    } else {
      return undefined
    }
  }

  static async create(
    signer: JsonRpcSigner | Wallet,
    question: string,
    answers: string[],
    pollType: PollType,
    chainId: number,
    minToken?: BigNumber,
    endTime?: number
  ): Promise<PollInitMsg | undefined> {
    return this._createWithSignFunction(
      createSignFunction(signer),
      signer,
      question,
      answers,
      pollType,
      chainId,
      minToken,
      endTime
    )
  }

  encode() {
    try {
      const arrayify = utils.arrayify
      const pollProto: PollInit = {
        owner: arrayify(this.owner),
        timestamp: this.timestamp,
        question: this.question,
        answers: this.answers,
        pollType: this.pollType,
        endTime: this.endTime,
        signature: arrayify(this.signature),
      }

      if (this.pollType === PollType.NON_WEIGHTED) {
        if (this.minToken) {
          pollProto.minToken = arrayify(this.minToken)
        } else {
          return undefined
        }
      }
      return proto.PollInit.encode(pollProto)
    } catch {
      return undefined
    }
  }

  static decode(wakuMessage: WakuMessage, chainId: number, verifyFunction?: (params: any, address: string) => boolean) {
    try {
      const timestamp = wakuMessage.timestamp
      const payload = proto.PollInit.decode(wakuMessage.payload)
      if (!timestamp || timestamp.getTime() != payload.timestamp) {
        return undefined
      }

      const msg: Message = {
        timestamp: payload.timestamp,
        question: payload.question,
        answers: payload.answers,
        pollType: payload.pollType,
        endTime: payload.endTime,
        owner: utils.getAddress(utils.hexlify(payload.owner)),
        minToken: payload.minToken ? BigNumber.from(payload.minToken) : undefined,
      }
      const signature = utils.hexlify(payload.signature)
      const params = {
        data: createSignMsgParams(msg, chainId),
        sig: signature,
      }
      if (verifyFunction ? !verifyFunction : !verifySignature(params, msg.owner)) {
        return undefined
      }
      return new PollInitMsg(signature, msg, chainId)
    } catch {
      return undefined
    }
  }
}

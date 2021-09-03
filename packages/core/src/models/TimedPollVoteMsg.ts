import { BigNumber, utils } from 'ethers'
import { JsonRpcSigner } from '@ethersproject/providers'
import protons, { TimedPollVote } from 'protons'
import { Wallet } from 'ethers'
import { createSignedMsg } from '../utils/createSignedMsg'
import { recoverTypedSignature_v4 } from 'eth-sig-util'
import { verifySignature } from '../utils/verifySignature'

const proto = protons(`
message TimedPollVote {
    bytes pollId = 1; // id of a poll
    bytes voter = 2; // Address of a voter
    int64 timestamp = 3; // Timestamp of a waku message
    int64 answer = 4; // specified poll answer
    optional bytes tokenAmount = 5; // amount of token used for WEIGHTED voting
    bytes signature = 6; // signature of all above fields
}
`)

type Message = {
  pollId: string
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
        { name: 'pollId', type: 'string' },
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
  public pollId: string
  public voter: string
  public timestamp: number
  public answer: number
  public tokenAmount?: BigNumber
  public signature: string
  public id: string

  constructor(signature: string, msg: Message) {
    this.id = utils.id([msg.voter, msg.timestamp, signature].join())
    this.pollId = msg.pollId
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
    pollId: string,
    answer: number,
    tokenAmount?: BigNumber
  ): Promise<TimedPollVoteMsg | undefined> {
    const voter = await signer.getAddress()
    const msg = { pollId, voter, timestamp: Date.now(), answer, tokenAmount }
    const params = [msg.voter, JSON.stringify(createSignMsgParams(msg))]
    return signFunction(msg, params, TimedPollVoteMsg)
  }
  static async create(
    signer: JsonRpcSigner | Wallet,
    pollId: string,
    answer: number,
    tokenAmount?: BigNumber
  ): Promise<TimedPollVoteMsg | undefined> {
    return this._createWithSignFunction(createSignedMsg(signer), signer, pollId, answer, tokenAmount)
  }

  encode() {
    try {
      const voteProto: TimedPollVote = {
        pollId: utils.arrayify(this.pollId),
        voter: utils.arrayify(this.voter),
        timestamp: this.timestamp,
        answer: this.answer,
        tokenAmount: this.tokenAmount ? utils.arrayify(this.tokenAmount) : undefined,
        signature: utils.arrayify(this.signature),
      }
      return proto.TimedPollVote.encode(voteProto)
    } catch {
      return undefined
    }
  }

  static decode(
    rawPayload: Uint8Array | undefined,
    timestamp: Date | undefined,
    verifyFunction?: (params: any, address: string) => boolean
  ) {
    try {
      const payload = proto.TimedPollVote.decode(rawPayload)
      if (!timestamp || !payload.timestamp || timestamp?.getTime() != payload.timestamp) {
        return undefined
      }
      const signature = utils.hexlify(payload.signature)

      const msg = {
        pollId: utils.hexlify(payload.pollId),
        answer: payload.answer,
        voter: utils.getAddress(utils.hexlify(payload.voter)),
        timestamp: payload.timestamp,
        tokenAmount: payload.tokenAmount ? BigNumber.from(payload.tokenAmount) : undefined,
      }

      const params = {
        data: createSignMsgParams(msg),
        sig: signature,
      }
      if (verifyFunction ? !verifyFunction : !verifySignature(params, msg.voter)) {
        return undefined
      }
      return new TimedPollVoteMsg(signature, msg)
    } catch {
      return undefined
    }
  }
}

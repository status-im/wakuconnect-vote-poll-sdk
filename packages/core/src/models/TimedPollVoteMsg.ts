import { BigNumber, utils } from 'ethers'
import { JsonRpcSigner } from '@ethersproject/providers'
import { TimedPollVote } from 'protons'
import { Wallet } from 'ethers'

export class TimedPollVoteMsg {
  public id: string
  public voter: string
  public timestamp: number
  public answer: number
  public tokenAmount?: BigNumber
  public signature: string

  private constructor(
    id: string,
    voter: string,
    timestamp: number,
    answer: number,
    signature: string,
    tokenAmount?: BigNumber
  ) {
    this.id = id
    this.voter = voter
    this.timestamp = timestamp
    this.answer = answer
    this.tokenAmount = tokenAmount

    this.signature = signature
  }

  static async create(
    signer: JsonRpcSigner | Wallet,
    id: string,
    answer: number,
    tokenAmount?: BigNumber
  ): Promise<TimedPollVoteMsg> {
    const voter = await signer.getAddress()
    const timestamp = Date.now()

    const msg: (string | number | BigNumber)[] = [id, voter, timestamp, answer]
    const types = ['bytes32', 'address', 'uint256', 'uint64']
    if (tokenAmount) {
      msg.push(tokenAmount)
      types.push('uint256')
    }

    const packedData = utils.arrayify(utils.solidityPack(types, msg))
    const signature = await signer.signMessage(packedData)
    return new TimedPollVoteMsg(id, voter, timestamp, answer, signature, tokenAmount)
  }

  static fromProto(payload: TimedPollVote) {
    const id = utils.hexlify(payload.id)
    const voter = utils.getAddress(utils.hexlify(payload.voter))
    const timestamp = payload.timestamp
    const answer = payload.answer
    const signature = utils.hexlify(payload.signature)
    const tokenAmount = payload.tokenAmount ? BigNumber.from(payload.tokenAmount) : undefined

    const msg: (string | number | BigNumber)[] = [id, voter, timestamp, answer]
    const types = ['bytes32', 'address', 'uint256', 'uint64']
    if (tokenAmount) {
      msg.push(tokenAmount)
      types.push('uint256')
    }

    const packedData = utils.arrayify(utils.solidityPack(types, msg))
    const verifiedAddress = utils.verifyMessage(packedData, signature)
    if (verifiedAddress != voter) {
      return undefined
    }
    return new TimedPollVoteMsg(id, voter, timestamp, answer, signature, tokenAmount)
  }
}

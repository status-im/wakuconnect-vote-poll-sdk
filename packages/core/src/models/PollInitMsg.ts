import { PollType } from '../types/PollType'
import { BigNumber, utils } from 'ethers'
import { JsonRpcSigner } from '@ethersproject/providers'

export class PollInitMsg {
  public owner: string
  public timestamp: number
  public question: string
  public answers: string[]
  public pollType: PollType
  public minToken?: BigNumber
  public endTime: number
  public signature: string

  private constructor(
    owner: string,
    signature: string,
    timestamp: number,
    question: string,
    answers: string[],
    pollType: PollType,
    endTime: number,
    minToken?: BigNumber
  ) {
    this.owner = owner
    this.timestamp = timestamp
    this.question = question
    this.answers = answers
    this.pollType = pollType
    this.minToken = minToken
    this.endTime = endTime

    this.signature = signature
  }

  static async create(
    signer: JsonRpcSigner,
    question: string,
    answers: string[],
    pollType: PollType,
    minToken?: BigNumber,
    endTime?: number
  ): Promise<PollInitMsg> {
    const owner = await signer.getAddress()
    const timestamp = Date.now()
    let newEndTime = timestamp + 10000000
    if (endTime) {
      newEndTime = endTime
    }

    const msg: (string | number | BigNumber | PollType)[] = [
      owner,
      timestamp,
      question,
      answers.join(),
      pollType,
      newEndTime,
    ]
    const types = ['address', 'uint256', 'string', 'string', 'uint8', 'uint256']
    if (pollType === PollType.NON_WEIGHTED) {
      if (minToken) {
        msg.push(minToken)
      } else {
        msg.push(BigNumber.from(1))
        minToken = BigNumber.from(1)
      }
      types.push('uint256')
    }

    const packedData = utils.arrayify(utils.solidityPack(types, msg))
    const signature = await signer.signMessage(packedData)

    return new PollInitMsg(owner, signature, timestamp, question, answers, pollType, newEndTime, minToken)
  }
}

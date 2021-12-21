import { Waku } from 'js-waku'
import { JsonRpcSigner } from '@ethersproject/providers'
import { PollInitMsg } from '../models/PollInitMsg'
import { PollType } from '../types/PollType'
import { BigNumber, Wallet } from 'ethers'
import { WakuMessage } from 'js-waku'
import { TimedPollVoteMsg } from '../models/TimedPollVoteMsg'
import { DetailedTimedPoll } from '../models/DetailedTimedPoll'
import { createWaku } from '../utils/createWaku'
import { WakuMessaging } from './WakuMessaging'
import { Web3Provider } from '@ethersproject/providers'
import { WakuMessagesSetup } from '../types/WakuMessagesSetup'

const MinTokenDefaultValue = BigNumber.from(1)

export enum MESSAGE_SENDING_RESULT {
  ok = 0,
  notEnoughToken = 1,
  errorCreatingMessage = 2,
  pollNotFound = 3,
}

export class WakuPolling extends WakuMessaging {
  protected constructor(
    appName: string,
    tokenAddress: string,
    provider: Web3Provider,
    chainId: number,
    multicall: string,
    waku?: Waku
  ) {
    super(
      appName,
      tokenAddress,
      provider,
      chainId,
      multicall,
      [
        {
          name: 'pollInit',
          tokenCheckArray: ['owner'],
          decodeFunction: (wakuMessage) => PollInitMsg.decode(wakuMessage, chainId),
          filterFunction: (e: PollInitMsg) => e.endTime > Date.now(),
        },
        {
          name: 'pollVote',
          tokenCheckArray: ['voter'],
          decodeFunction: (wakuMessage) => TimedPollVoteMsg.decode(wakuMessage, chainId),
        },
      ],
      waku
    )
  }

  public static async create(
    appName: string,
    tokenAddress: string,
    provider: Web3Provider,
    multicall: string,
    waku?: Waku
  ) {
    const network = await provider.getNetwork()
    const wakuPolling = new WakuPolling(appName, tokenAddress, provider, network.chainId, multicall, waku)
    return wakuPolling
  }

  public async createTimedPoll(
    question: string,
    answers: string[],
    pollType: PollType,
    minToken?: BigNumber,
    endTime?: number
  ) {
    const signer = this.provider.getSigner()
    const address = await signer.getAddress()
    await this.updateBalances([address])

    if (this.addressesBalances[address] && this.addressesBalances[address]?.gt(minToken ?? MinTokenDefaultValue)) {
      const pollInit = await PollInitMsg.create(signer, question, answers, pollType, this.chainId, minToken, endTime)
      if (pollInit) {
        await this.sendWakuMessage(this.wakuMessages['pollInit'], pollInit)
        return MESSAGE_SENDING_RESULT.ok
      } else {
        return MESSAGE_SENDING_RESULT.errorCreatingMessage
      }
    } else {
      return MESSAGE_SENDING_RESULT.notEnoughToken
    }
  }

  public async sendTimedPollVote(pollId: string, selectedAnswer: number, tokenAmount?: BigNumber) {
    const signer = this.provider.getSigner()
    const address = await signer.getAddress()
    const poll = this.wakuMessages['pollInit'].arr.find((poll: PollInitMsg): poll is PollInitMsg => poll.id === pollId)
    if (poll) {
      await this.updateBalances([address])
      if (
        this.addressesBalances[address] &&
        this.addressesBalances[address]?.gt(poll.minToken ?? MinTokenDefaultValue)
      ) {
        const pollVote = await TimedPollVoteMsg.create(signer, pollId, selectedAnswer, this.chainId, tokenAmount)
        if (pollVote) {
          await this.sendWakuMessage(this.wakuMessages['pollVote'], pollVote)
        } else {
          return MESSAGE_SENDING_RESULT.errorCreatingMessage
        }
      } else {
        return MESSAGE_SENDING_RESULT.notEnoughToken
      }
    } else {
      return MESSAGE_SENDING_RESULT.pollNotFound
    }
  }

  public async getDetailedTimedPolls() {
    await this.updateBalances()
    return this.wakuMessages['pollInit'].arr
      .map((poll: PollInitMsg) => {
        if (
          this.addressesBalances[poll.owner] &&
          this.addressesBalances[poll.owner]?.gt(poll.minToken ?? MinTokenDefaultValue)
        ) {
          return new DetailedTimedPoll(
            poll,
            this.wakuMessages['pollVote'].arr
              .filter(
                (vote: TimedPollVoteMsg) =>
                  vote.pollId === poll.id &&
                  this.addressesBalances[poll.owner] &&
                  this.addressesBalances[vote.voter]?.gt(poll.minToken ?? MinTokenDefaultValue)
              )
              .filter((e): e is TimedPollVoteMsg => !!e)
          )
        } else {
          return undefined
        }
      })
      .filter((e): e is DetailedTimedPoll => !!e)
  }
}

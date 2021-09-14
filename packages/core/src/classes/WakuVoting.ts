import { VotingContract } from '@status-waku-voting/contracts/abi'
import { WakuMessaging } from './WakuMessaging'
import { Contract, Wallet, BigNumber } from 'ethers'
import { Waku, WakuMessage } from 'js-waku'
import { Provider } from '@ethersproject/abstract-provider'
import { createWaku } from '../utils/createWaku'
import { JsonRpcSigner } from '@ethersproject/providers'
import { VoteMsg } from '../models/VoteMsg'
import { VotingRoom } from '../types/PollType'

const ABI = [
  'function aggregate(tuple(address target, bytes callData)[] calls) view returns (uint256 blockNumber, bytes[] returnData)',
]

export class WakuVoting extends WakuMessaging {
  private votingContract: Contract

  constructor(
    appName: string,
    votingContract: Contract,
    token: string,
    provider: Provider,
    chainId: number,
    multicallAddress: string,
    waku?: Waku
  ) {
    super(appName, token, provider, chainId, multicallAddress, waku)
    this.votingContract = votingContract
    this.wakuMessages['vote'] = {
      topic: `/${this.appName}/waku-voting/votes/proto/`,
      hashMap: {},
      arr: [],
      tokenCheckArray: ['voter'],
      updateFunction: (msg: WakuMessage[]) =>
        this.decodeMsgAndSetArray(
          msg,
          (payload, timestamp, chainId) => VoteMsg.decode(payload, timestamp, chainId, this.votingContract.address),
          this.wakuMessages['vote']
        ),
    }
    this.setObserver()
  }

  public static async create(
    appName: string,
    contractAddress: string,
    provider: Provider,
    multicall: string,
    waku?: Waku
  ) {
    const network = await provider.getNetwork()
    const votingContract = new Contract(contractAddress, VotingContract.abi, provider)
    const tokenAddress = await votingContract.token()
    return new WakuVoting(appName, votingContract, tokenAddress, provider, network.chainId, multicall, waku)
  }

  public async createVote(
    signer: JsonRpcSigner | Wallet,
    question: string,
    descripiton: string,
    tokenAmount: BigNumber
  ) {
    this.votingContract = await this.votingContract.connect(signer)
    await this.votingContract.initializeVotingRoom(question, descripiton, tokenAmount)
  }

  private lastPolls: VotingRoom[] = []
  private lastGetPollsBlockNumber = 0

  public async getVotingRooms() {
    const blockNumber = await this.provider.getBlockNumber()
    if (blockNumber != this.lastGetPollsBlockNumber) {
      this.lastGetPollsBlockNumber = blockNumber
      const polls = await this.votingContract.getVotingRooms()
      this.lastPolls = polls.map((poll: any, idx: number): VotingRoom => {
        const timeLeft = poll[1].toNumber() - Date.now() / 1000
        return {
          startBlock: poll[0],
          endAt: poll[1],
          question: poll[2],
          description: poll[3],
          totalVotesFor: poll[4],
          totalVotesAgainst: poll[5],
          voters: poll[6],
          id: idx,
          timeLeft,
          voteWinner: timeLeft <= 0 ? (poll[5].gt(poll[4]) ? 1 : 2) : undefined,
        }
      })
    }
    return this.lastPolls
  }

  public async getVotingRoom(id: number) {
    return (await this.getVotingRooms())[id]
  }

  public async sendVote(
    signer: JsonRpcSigner | Wallet,
    roomId: number,
    selectedAnswer: number,
    tokenAmount: BigNumber
  ) {
    const vote = await VoteMsg._createWithSignFunction(
      signer,
      roomId,
      selectedAnswer,
      this.chainId,
      tokenAmount,
      this.votingContract.address
    )
    await this.sendWakuMessage(this.wakuMessages['vote'], vote)
  }
}

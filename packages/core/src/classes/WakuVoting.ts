import { VotingContract } from '@status-waku-voting/contracts/abi'
import { WakuMessaging } from './WakuMessaging'
import { Contract, Wallet, BigNumber } from 'ethers'
import { Waku, WakuMessage } from 'js-waku'
import { Provider } from '@ethersproject/abstract-provider'
import { createWaku } from '../utils/createWaku'
import { JsonRpcSigner } from '@ethersproject/providers'
import { VoteMsg } from '../models/VoteMsg'

const ABI = [
  'function aggregate(tuple(address target, bytes callData)[] calls) view returns (uint256 blockNumber, bytes[] returnData)',
]

export class WakuVoting extends WakuMessaging {
  private multicall: Contract
  private votingContract: Contract

  constructor(
    appName: string,
    votingContract: Contract,
    token: string,
    waku: Waku,
    provider: Provider,
    chainId: number,
    multicallAddress: string
  ) {
    super(appName, token, waku, provider, chainId)
    this.votingContract = votingContract
    this.multicall = new Contract(multicallAddress, ABI, this.provider)
    this.wakuMessages['vote'] = {
      topic: `/${this.appName}/waku-voting/votes/proto/`,
      hashMap: {},
      arr: [],
      updateFunction: (msg: WakuMessage[]) =>
        this.decodeMsgAndSetArray(
          msg,
          (payload, timestamp, chainId) => VoteMsg.decode(payload, timestamp, chainId, this.votingContract.address),
          this.wakuMessages['vote']
        ),
    }
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
    return new WakuVoting(
      appName,
      votingContract,
      tokenAddress,
      await createWaku(waku),
      provider,
      network.chainId,
      multicall
    )
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

  private lastPolls: any[] = []
  private lastGetPollsBlockNumber = 0

  public async getVotes() {
    const blockNumber = await this.provider.getBlockNumber()
    if (blockNumber != this.lastGetPollsBlockNumber) {
      this.lastGetPollsBlockNumber = blockNumber
      this.lastPolls = await this.votingContract.getVotingRooms()
    }
    return this.lastPolls
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

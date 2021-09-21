import { VotingContract } from '@status-waku-voting/contracts/abi'
import { WakuMessaging } from './WakuMessaging'
import { Contract, Wallet, BigNumber, ethers, utils } from 'ethers'
import { Waku, WakuMessage } from 'js-waku'
import { createWaku } from '../utils/createWaku'
import { JsonRpcSigner, Web3Provider } from '@ethersproject/providers'
import { VoteMsg } from '../models/VoteMsg'
import { VotingRoom } from '../types/PollType'
import { DetailedVotingRoom } from '../models/DetailedVotingRoom'

const ABI = [
  'function aggregate(tuple(address target, bytes callData)[] calls) view returns (uint256 blockNumber, bytes[] returnData)',
]

export class WakuVoting extends WakuMessaging {
  private votingContract: Contract
  public providerName: string
  constructor(
    appName: string,
    votingContract: Contract,
    token: string,
    provider: Web3Provider,
    chainId: number,
    multicallAddress: string,
    providerName: string,
    waku?: Waku
  ) {
    super(
      appName,
      token,
      provider,
      chainId,
      multicallAddress,
      [
        {
          name: 'vote',
          tokenCheckArray: ['voter'],
          decodeFunction: (wakuMessage) => VoteMsg.decode(wakuMessage, chainId, votingContract.address),
        },
      ],
      waku
    )
    this.providerName = providerName
    this.votingContract = votingContract
  }

  public static async create(
    appName: string,
    contractAddress: string,
    provider: Web3Provider,
    multicall: string,
    waku?: Waku
  ) {
    const network = await provider.getNetwork()
    const votingContract = new Contract(contractAddress, VotingContract.abi, provider)
    const tokenAddress = await votingContract.token()
    const providerName = (await provider.getNetwork()).name
    return new WakuVoting(
      appName,
      votingContract,
      tokenAddress,
      provider,
      network.chainId,
      multicall,
      providerName,
      waku
    )
  }

  public async createVote(question: string, descripiton: string, tokenAmount: BigNumber) {
    if (this.provider) {
      const signer = this.provider.getSigner()
      this.votingContract = await this.votingContract.connect(signer)
      await this.votingContract.initializeVotingRoom(question, descripiton, tokenAmount)
    }
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
      await Promise.all(
        this.lastPolls.map(async (poll) => {
          if (!poll.transactionHash) {
            const block = await this.provider.getBlockWithTransactions(poll.startBlock.toNumber())
            poll.transactionHash = block.transactions.find(
              (transaction) => transaction.to === this.votingContract.address
            )?.hash
          }
        })
      )
    }
    return this.lastPolls.slice().reverse()
  }

  public async getVotingRoom(id: number) {
    try {
      await this.getVotingRooms()
      return this.lastPolls[id]
    } catch {
      return undefined
    }
  }

  public async sendVote(roomId: number, selectedAnswer: number, tokenAmount: BigNumber) {
    const signer = this.provider.getSigner()
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

  public async commitVotes(votes: VoteMsg[]) {
    const signer = this.provider.getSigner()
    const mappedVotes = votes.map((vote) => {
      const sig = utils.splitSignature(vote.signature)
      return [vote.voter, BigNumber.from(vote.roomId).mul(2).add(vote.answer), vote.tokenAmount, sig.r, sig._vs]
    })
    this.votingContract = this.votingContract.connect(signer)
    this.votingContract.castVotes(mappedVotes)
  }

  public async getRoomWakuVotes(id: number) {
    await this.updateBalances()
    const votingRoom = await this.getVotingRoom(id)
    if (!votingRoom || votingRoom.timeLeft < 0) {
      return undefined
    }
    const votersHashMap: { [voter: string]: boolean } = {}
    votingRoom.voters.forEach((voter) => (votersHashMap[voter] = true))
    const newVotingRoom: VotingRoom = { ...votingRoom }
    const wakuVotes = this.wakuMessages['vote'].arr.filter((vote: VoteMsg) => {
      if (
        vote.roomId === id &&
        this.addressesBalances[vote.voter] &&
        this.addressesBalances[vote.voter]?.gt(vote.tokenAmount)
      ) {
        if (!votersHashMap[vote.voter]) {
          votersHashMap[vote.voter] = true
          if (vote.answer === 0) {
            newVotingRoom.totalVotesAgainst = newVotingRoom.totalVotesAgainst.add(vote.tokenAmount)
          } else {
            newVotingRoom.totalVotesFor = newVotingRoom.totalVotesFor.add(vote.tokenAmount)
          }
          return true
        }
      }
      return false
    }) as VoteMsg[]

    const sum = wakuVotes.reduce((prev, curr) => prev.add(curr.tokenAmount), BigNumber.from(0))
    return { sum, wakuVotes, newVotingRoom }
  }
}

import { VotingContract } from '@waku/vote-sdk-contracts/abi'
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
    const wakuVoting = new WakuVoting(
      appName,
      votingContract,
      tokenAddress,
      provider,
      network.chainId,
      multicall,
      providerName,
      waku
    )
    return wakuVoting
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
  private lastActivePoll = 0

  public async getVotingRooms() {
    const blockNumber = await this.provider.getBlockNumber()
    if (blockNumber != this.lastGetPollsBlockNumber) {
      this.lastGetPollsBlockNumber = blockNumber

      this.lastActivePoll = this.lastPolls.findIndex((poll) => poll.timeLeft > 0)
      if (this.lastActivePoll < 0) {
        this.lastActivePoll = this.lastPolls.length
      }
      const polls = await this.votingContract.getVotingRoomsFrom(this.lastActivePoll)
      polls.forEach((poll: any) => {
        const timeLeft = poll[1].toNumber() * 1000 - Date.now()
        const votingRoom: VotingRoom = {
          startBlock: poll[0],
          endAt: poll[1],
          question: poll[2],
          description: poll[3],
          totalVotesFor: poll[4],
          totalVotesAgainst: poll[5],
          wakuTotalVotesFor: poll[4],
          wakuTotalVotesAgainst: poll[5],
          voters: poll[7],
          id: BigNumber.from(poll[6]).toNumber(),
          timeLeft,
          voteWinner: timeLeft <= 0 ? (poll[5].gt(poll[4]) ? 1 : 2) : undefined,
        }
        if (this.lastPolls[votingRoom.id]) {
          this.lastPolls[votingRoom.id] = votingRoom
        } else {
          this.lastPolls.push(votingRoom)
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

  public async getVotingRoom(id: number) {
    await this.updateBalances()
    let votingRoom: VotingRoom
    try {
      await this.getVotingRooms()
      votingRoom = this.lastPolls[id]
      votingRoom.wakuVotes = undefined
      votingRoom.wakuTotalVotesAgainst = votingRoom.totalVotesAgainst
      votingRoom.wakuTotalVotesFor = votingRoom.totalVotesFor
    } catch {
      return undefined
    }
    if (!votingRoom) {
      return undefined
    }
    if (votingRoom.timeLeft < 0) {
      return votingRoom
    }
    const votersHashMap: { [voter: string]: boolean } = {}
    votingRoom.voters.forEach((voter) => (votersHashMap[voter] = true))
    const wakuVotes = this.wakuMessages['vote'].arr.filter((vote: VoteMsg) => {
      if (
        vote.roomId === id &&
        this.addressesBalances[vote.voter] &&
        this.addressesBalances[vote.voter]?.gt(vote.tokenAmount)
      ) {
        if (!votersHashMap[vote.voter]) {
          votersHashMap[vote.voter] = true
          if (vote.answer === 0) {
            votingRoom.wakuTotalVotesAgainst = votingRoom.wakuTotalVotesAgainst.add(vote.tokenAmount)
          } else {
            votingRoom.wakuTotalVotesFor = votingRoom.wakuTotalVotesFor.add(vote.tokenAmount)
          }
          return true
        }
      }
      return false
    }) as VoteMsg[]

    const sum = wakuVotes.reduce((prev, curr) => prev.add(curr.tokenAmount), BigNumber.from(0))
    votingRoom.wakuVotes = { sum, votes: wakuVotes }
    return votingRoom
  }
}

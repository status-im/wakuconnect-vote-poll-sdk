## Waku Messaging

Is a general class that takes care of keeping waku messages of given topic up to date as well as each address tokens.

This class is meant to be extended by other classes.

When creating a object of this class devs need to provide

``` 
    appName: string // name of a string used for waku topics
    tokenAddress: string // address of token contract used to verify messages
    provider: Web3Provider
    chainId: number,
    multicall: string // address of multicall contract in given chainId
    wakuMessagesSetup: WakuMessagesSetup<any>[] // objects that define waku messages that are to be updated
    waku?: Waku // object of Waku class
```

WakuMessagesSetup is defined as follows

```
WakuMessagesSetup<T> = {
  name: string // name of wakuMessages
  tokenCheckArray: string[] // array of fields in waku message that are to be checked for token balance
  decodeFunction: (wakuMessage: WakuMessage) => T | undefined // function that decodes raw WakuMessage
  filterFunction?: (e: T) => boolean // function that filters waku messages
}
```

Waku Messages are stored in `this.wakuMessages[name]` and are of type 

```
type WakuMessageStore = {
  topic: string 
  hashMap: { [id: string]: boolean }
  tokenCheckArray: string[]
  arr: any[] // array holding 
  updateFunction: (msg: WakuMessage[]) => void
}
```

# Voting 

Voting is done on-chain and allows to accumulate votes over waku network to allow user for voting without gas (although those votes won't be counted until someone commits those votes to blockchain).

To make it easier to use WakuVoting class makes it easier to create and use this kind of voting.

## Waku Voting

Objects of class of WakuVoting, hold their own Waku objects and also store list of proposals and votes for later use.

### Creating instance of WakuVoting

WakuVoting create function expects name of DApp and address of a voting contract, web3provider, also as optional parameter can take custom Waku object.

Address of token is derived from votingContract

```ts
    import { WakuVoting } from '@status-waku-voting/core'

    await WakuVoting.create(appName, contractAddress, provider, multicallAddress, waku)
```

### API

All api functions use `provider.getSigner()` to define signer

- `createVote(question: string, descripiton: string, tokenAmount: BigNumber)` creates new votingRoom on blockchain

- `getVotingRooms()` which return a list o VotingRoom

```
export type VotingRoom = {
  startBlock: BigNumber
  endAt: BigNumber
  question: string
  description: string
  totalVotesFor: BigNumber // amount of commited votes for
  totalVotesAgainst: BigNumber //amount of commited votes against
  wakuTotalVotesFor: BigNumber // amount of committed and uncomitted votes for
  wakuTotalVotesAgainst: BigNumber // amount of committed and uncomitted votes against
  wakuVotes?: {
    sum: BigNumber // sum of tokens of uncomitted votes
    votes: VoteMsg[] // array of uncomitted votes
  }
  voters: string[] // array of voters which votes has been commited
  id: number
  timeLeft: number
  voteWinner: number | undefined
  transactionHash?: string
}
```

- `sendVote(roomId: number, selectedAnswer: number, tokenAmount: BigNumber)` which sends waku vote

- `commitVotes(votes: VoteMsg[])` commits votes to blockchain

- `getVotingRoom(id: number)` gets VotingRoom with given id

# Polls

Polls are similar to twitter polls with main difference being that they aren't immutable and only appear on network for limited time. 

To create a poll user has to send a message over waku network on specific topic 

`/{dapp name}/waku-polling/timed-polls-init/proto`

For a poll to be started waku message has to have specific fields:

```proto
message PollInit {
    bytes owner = 1; // Address of a poll owner/initializer
    int64 timestamp = 2; // Timestamp of a waku message
    string question = 3;// Question of a poll
    repeated string answers = 4; // Possible answers to poll
    enum PollType {
        WEIGHTED = 0;
        NON_WEIGHTED = 1;
    }
    PollType pollType = 5 // type of poll
    optional bytes minToken = 6 // amount of token needed for NON_WEIGHTED poll to be able to vote
    int64 endTime = 7 // UNIX timestamp of poll end
    bytes signature = 8 // signature of all above fields
}
```

To vote on poll user has to send waku message on topic:

`/{dapp name}/waku-polling/votes/proto`

Proto fields for poll vote

```proto
message TimedPollVote {
    bytes id = 1; // id of a poll
    bytes voter = 2; // Address of a voter
    int64 timestamp = 3; // Timestamp of a waku message
    int64 answer = 4; // specified poll answer
    optional bytes tokenAmount = 5; // amount of token used for WEIGHTED voting
    bytes signature = 6; // signature of all above fields
}
```

To make it easier to use WakuPolling class was created

## Creating instance of WakuPolling

WakuPolling create expects name of DApp and address of a token contract, web3provider, also as optional parameter can take custom Waku object.

```ts
    import { WakuPolling } from '@status-waku-voting/core'

    await WakuPolling.create(appName, tokenAddress, provider, multicallAddress, waku)
```


### API

All api functions use `provider.getSigner()` to define signer

- `createTimedPoll(question: string, answers: string[], pollType: PollType, minToken?: BigNumber, endTime?: number)` creates new poll on waku network 

`question` is a question of a poll
`answers` is a array of possible answers in poll, order of answers stays the same

`pollType` determines type of poll

```
export enum PollType {
  WEIGHTED = 0,
  NON_WEIGHTED = 1,
}
```

`minToken` determines how much tokens user need to hold to be able to vote in NON_WEIGHTED poll

- `sendTimedPollVote(pollId: string, selectedAnswer: number, tokenAmount?: BigNumber)` sends a vote on a given poll

`pollId` id of poll
`selectedAnswer` id of given answer in a poll
`tokenAmount` if poll is weighted this determines with how much tokens user votes

-`getDetailedTimedPolls()` returns a list of `DetailedTimedPoll`

```
DetailedTimedPoll {
  answers: TimedPollAnswer[]
  poll: PollInitMsg
  votesMessages: TimedPollVoteMsg[]
  numberOfVotes: BigNumber
}

TimedPollAnswer {
  text: string
  votes: BigNumber
}

PollInitMsg {
  owner: string
  timestamp: number
  question: string
  answers: string[]
  pollType: PollType
  minToken?: BigNumber
  endTime: number
  signature: string
  id: string
  chainId: number
}

TimedPollVoteMsg {
  pollId: string
  voter: string
  timestamp: number
  answer: number
  tokenAmount?: BigNumber
  signature: string
  id: string
  chainId: number
}
```

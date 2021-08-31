# status-waku-voting/contracts 
Status white label proposal contract


## Voting Contract

Voting contract is a smart contract created for purpose of
having smart contract that can create and save results of proposals.

This Contract is responsible for creating voting rooms in which you can vote for or against them.

Lifecycle of voting room:
    1. initialize voting room.
    2. period of time when votes are accepted.
    3. voting time is finished votes are no longer accepted.
    
### Types

Main types used for voting are:

- `VotingRoom`

    Is a type that hold information about voting room for a given proposal

    #### Fields
    ```solidity
    //block at which room was created
    uint256 startBlock; 
    //timestamp after which new votes won't be accepted
    uint256 endAt; 
    // question of a proposal which voting room describes
    string question;
    // description for proposal
    string description;
    // amount of summed votes for
    uint256 totalVotesFor;
    // amount of summed votes against
    uint256 totalVotesAgainst;
    //list of addresses that already voted
    address[] voters;
    ```

- `Vote`

    Is a type that hold information about vote for a given voting room

    #### Fields
    ```solidity
    //address of a voter
    address voter;
    // encoded roomId and type
    // first bit this field is a vote type:
    // 1 is a vote for
    // 0 is a vote against
    // rest of this field is a roomId shifted one bit to 
    // the left
    uint256 roomIdAndType;
    // amount of token used to vote
    uint256 tokenAmount;
    //signature of vote
    bytes32 r;
    bytes32 vs;
    ```

### Constants and variables

- `token`
    Variable that holds address of token used for vote verification. It is assigned at contract creation.

- `VOTING_LENGTH`
    Constant describing length of voting room in seconds
    TODO:
        - maybe set voting length per voting room ?

- `EIP712DOMAIN_TYPEHASH`
    Constant holding type hash of EIP712 domain as per EIP712 specification

- `VOTE_TYPEHASH`
    Constant holding type hash of Vote as per EIP712 specification

- `DOMAIN_SEPARATOR`
    Variable holding hash of domain separator according to EIP712 spec. Assigned at smart contract creation.

- `voted`
    this variable holds information if given address voted in a given voting room. So it is a mapping of room id to mapping of addresses to bools which say whether or not given address voted.

- `votingRooms`
    Array that holds all voting rooms. roomId of voting room is equivalent to its index in array

### Signing with EIP712

This smart contract uses EIP712 for signing vote msg.
The structure of typed data for vote messages is as follows:
```ts
{
  types: {
      EIP712Domain: [
          { name: 'name', type: 'string' },
          { name: 'version', type: 'string' },
          { name: 'chainId', type: 'uint256' },
          { name: 'verifyingContract', type: 'address' },
      ],
      Vote: [
        { name: 'roomIdAndType', type: 'uint256' },
        { name: 'tokenAmount', type: 'uint256' },
        { name: 'voter', type: 'address' },
      ],
  },
  primaryType: 'Vote',
  domain: {
      name: 'Voting Contract',
      version: '1',
      chainId: chainId,
      verifyingContract: contract.address,
  },
  message: {
      voter: voterAddress,
      tokenAmount: tokenAmount,
      roomIdAndType: roomIdAndType
  }
}
```

For more information about EIP-712 go to [docs](https://eips.ethereum.org/EIPS/eip-712)

### Functions

- `constructor(IERC20 _address)`
    assigns `_address` to `token` and generates `DOMAIN_SEPARATOR`

- `getVotingRooms()`
    returns votingRooms

- `listRoomVoters(uint256 roomId)`
    returns a list of voters for a given voting room. Reverts if roomId doesn't exist.

- `initializeVotingRoom(string calldata question,string calldata description,uint256 voteAmount)`
    Creates a new voting room with vote for set to voteAmount.
    First checks if voter has enough tokens to set vote for.
    Then creates a new voting room.
    `startBlock` is set as current block number.
    `endAt` is set a current block timestamp plus.`VOTING_LENGTH`.
    `question` is set as argument `question`.
    `description` is set as argument `description`.
    `totalVotesFor` is set as argument `voteAmount`.
    Mapping `voted` of new voting room id of `msg.sender` is set to true to reflect that message sender has voted on this voting room with `voteAmount`.
    `votingRooms` are appended with newVotingRoom and `voters` in this new appended element are appended with message sender.
    After room init `VotingRoomStarted` is emitted.

- `verify(Vote calldata vote,bytes32 r,bytes32 vs)`
    Function used to verify that `vote` was signed by `vote.voter` as per EIP712 specification.
    See [docs](https://eips.ethereum.org/EIPS/eip-712) for more info.

- `updateRoomVotes(Vote calldata vote, uint256 roomId)`
    Sets totalVotes amount of voting room with index corresponding to `roomId`.

    If voting first bit of `vote.roomIdAndType` is 1 that means that vote is for and `vote.tokenAmount` is added to `votingRooms[roomId].totalVotesFor`, otherwise if `vote.roomIdAndType` is 0 `vote.tokenAmount` is added to `votingRooms[roomId].totalVotesAgainst`.

    After that add new address to room `voters` and updates mapping `voted` accordingly.

- `castVotes(Vote[] calldata votes)`
    Function used to cast votes in rooms.
    Function accepts an array of votes of type `Vote`.

    All votes are looped through and verified that votes are:
    - properly signed
    - voter has enough tokens to vote
    - voting room exists
    - voting room hasn't been closed

    Vote verification is as follows.
    First roomId is decoded from `vote.roomIdAndType` which means shifting it to the right once.

    Then it is verified that voting room with given roomId exists and isn't closed if not whole function reverts, this is to discourage grouping votes for different voting rooms together (! maybe it should be changed so that votes for multiple voting rooms can be cast ? !).
    
    After that it is verified that `vote` has been signed by `vote.voter`. If not function goes to another vote in array (IDEA: maybe vote verification failed should be emitted ?).

    Then it is checked that `vote.voter` didn't vote in this vote room before if he did function goes to another voter (IDEA: emit alreadyVoted ?).

    Last check is whether `vote.voter` has enough tokens to vote. If he does not `NotEnoughToken` is emitted and function goes to another voter. If he does voting room is updated with `updateRoomVotes` and `VoteCast` is emitted.

    TODO:
    - not emit on Not enough tokens ?
    - emit on wrong signature ?
    - if instead of require for voting room not found ?
    - if instead of require for vote closed ?
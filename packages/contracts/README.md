# wakuconnect-voting-sdk/contracts 

WakuConnect Proposal Contracts.

## Voting Contract

The Voting Contract is a smart contract that enables the storage of proposals, from creation to vote result.

Lifecycle of proposal:

1. Initialize proposal,
2. Proposal is open, votes are accepted,
3. Voting time ends, votes are no longer accepted, result is final.
    
### Types

The main types used in the contract are:

- `Proposal`

    Holds information about the proposal

    #### Fields
    ```solidity
    // block at which the proposal was created
    uint256 startBlock;
    // timestamp in seconds after which new votes won't be accepted
    // when casting votes endAt is compared to block.timestamp
    uint256 endAt;
    // proposal title
    string title;
    // proposal description
    string description;
    // total number of votes in favour of the proposal, this may be weighted
    uint256 totalVotesFor;
    // total number of votes against the proposal, this may be weighted
    uint256 totalVotesAgainst;
    // list of addresses that already voted
    address[] voters;
    ```

- `Vote`

    Holds the information for one vote

    #### Fields
    ```solidity
    // address of the voter
    address voter;
    // encoded proposalId and type
    // first bit this field is a vote type:
    // 1 is a vote for
    // 0 is a vote against
    // rest of this field is a roomId shifted one bit to 
    // the left
    uint256 proposalIdAndType;
    // amount of token used to vote
    uint256 tokenAmount;
    //signature of vote
    bytes32 r;
    bytes32 vs;
    ```

### Constants and variables

- `token`
    contract address of the token used for vote verification.
    It is assigned at contract creation.
    Only holders of this token can vote.

- `voteDuration`
    Length of duration during which proposals can be vote on, in seconds.
    It is assigned at contract creation.

- `EIP712DOMAIN_TYPEHASH`
    Constant holding type hash of EIP712 domain as per EIP712 specification.

- `VOTE_TYPEHASH`
    Constant holding type hash of Vote as per EIP712 specification.

- `DOMAIN_SEPARATOR`
    Variable holding hash of domain separator according to EIP712 spec.
    It is assigned at smart contract creation.

- `voted`
    Holds whether a given address has voted to a given proposal.
    It is a mapping of proposal id to mapping of addresses to booleans which indicates whether the given address has voted.

- `proposals`
    Array that holds all proposals.
    The id for a proposal is the index in this array.

### Signing with EIP712

EIP712 MUST be used to sign votes.
The structure of typed data for a vote message is as follows:
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
    Assigns `_address` to `token` and generates `DOMAIN_SEPARATOR`

- `getProposals()`
    Returns proposals

- `getProposalsLength()`
    Returns the length of the `proposals` array

- `getLastNProposals(uint256 amount)`
    Returns the N last proposals

- `getProposalFromId(uint256 id)`
    Gets proposal from given id

- `getOpenProposals()`
    Returns proposals for which `proposal.endAt > block.timestamp` which means the proposals are still accepting votes.
    Since `proposalDuration` is set at contract creation and never changed,
    `proposal.endAt` is never decreasing with increasing index of votingRoom.
    Therefore, it is enough to check from `proposal.length` up to first element which `endAt < block.timestamp`

- `listVotersForProposal(uint256 proposalId)`
    Returns a list of voters for a given proposal.
    Reverts if there are no proposal for the given `proposalId`.

- `initializeProposal(string calldata title, string calldata description, uint256 creatorVoteForAmount)`
    Creates a new proposal with the vote of the proposal creator.
    First checks if the creator voter has enough tokens to set vote for.
    Then creates a new proposal.
    `startBlock` is set as current block number.
    `endAt` is set a current block timestamp plus `votingDuration`.
    `title` is set as argument `title`.
    `description` is set as argument `description`.
    `creatorVoteForAmount` is set as argument `voteAmount`.
    Mapping `voted` of new proposal id of `msg.sender` is set to true to reflect that message sender has voted on this voting room with `creatorVoteForAmount`.
    `votingRooms` are appended with newVotingRoom and `voters` in this new appended element are appended with message sender.
    After proposal creation, `ProposalStarted` is emitted.

- `verify(Vote calldata vote, bytes32 r, bytes32 vs)`
    Function used to verify that `vote` was signed by `vote.voter` as per EIP712 specification.
    See [docs](https://eips.ethereum.org/EIPS/eip-712) for more info.

- `castVote(Vote calldata vote, uint256 proposalId)`
    Cast a single vote.
    Updates `totalVotes` amount of proposal with index corresponding to `proposalId`.

    If voting first bit of `vote.roomIdAndType` is 1 that means that vote is for and `vote.tokenAmount` is added to `votingRooms[roomId].totalVotesFor`, otherwise if `vote.roomIdAndType` is 0 `vote.tokenAmount` is added to `votingRooms[roomId].totalVotesAgainst`.

    After that add new address to room `voters` and updates mapping `voted` accordingly.

- `castVotes(Vote[] calldata votes)`
    Function used to cast votes on a single proposas.
    Function accepts an array of votes of type `Vote`.

    All votes are looped through and verified that votes are:
    - properly signed
    - voter has enough tokens to vote
    - proposal exists
    - proposal hasn't been closed

    Vote verification is as follows:
 
    First `proposalId` is decoded from `vote.proposalIdAndType` which means shifting it to the right once.

    Then it is verified that the proposal with given `proposalId` exists and isn't closed, otherwise, function reverts. 

    Then it is checked that `vote.voter` didn't vote in this vote room before if he did function goes to another voter (IDEA: emit alreadyVoted ?).
   
    After that it is verified that `vote` has been signed by `vote.voter`.

    Last check is whether `vote.voter` has enough tokens to vote.
    
    If all checks passed, the vote is cast with `castVote` and `VoteCast` is emitted.

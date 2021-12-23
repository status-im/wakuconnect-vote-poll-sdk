# WakuConnect Vote & Poll SDKs

A set of WakuConnect SDKs to enable gas efficient voting and gasless polling over Waku

## WakuConnect Vote SDK

The WakuConnect Vote SDK allows you to leverage Waku to save gas fees for most voters.

It leverages Waku, a decentralized communication network, to broadcast and aggregates votes.
Most token holders will not need to spend gas to vote.

Only the party that starts an election and submit the end results need to interact with the blockchain.

This can be used for a DAO for example:
- The DAO or a party that needs a proposal voted spend gas,
- The token holders do not spend gas when voting.

### Functional Overview

#### Setting up voting contract

The voting contract needs to be deployed on the blockchain and takes the following input:
- The ERC20 token contract address: Only holder of these tokens will be able to vote.
- Duration of an election: Elections expire after a fixed time.

#### Starting an election

An election can be started by any token holder,
therefore referred to as _moderator_.

An election needs to be started on chain,
the moderator starts the election by setting a question and description.

The moderator also casts the first vote in favour.

#### Running an election

All token holder can cast weighted votes without spending gas.
Votes are sent over Waku and each user can aggregate votes to learn the election forecast.

#### Submitting votes

The _moderator_, or any user, can aggregate the votes and submit them to the contract, spending gas.

Votes can be submitted in several steps, by different users.
This allows any user to submit missing or omitted votes to the blockchain to ensure that the result matches the actual opinion of the token holders.

#### Election end

The election ends when the expiry is reached.
_Moderator_ and token holders need to ensure they submit all votes to the blockchain before the expiry.

Once the expiry is reached, the result cannot be changed.

### Security considerations

#### 1. Who can start an election?
 
Anyone holding any amount of the specified ERC-20 token can start an election.

#### 2. Who can vote?

Anyone holding any amount of the specified ERC-20 token can vote.

#### 3. How are votes weighted?

Votes are weighted with a an amount of ERC-20 token specified by the voter.
The voter can only vote with the amount of token they hold at the time of submission of the vote to the blockchain.

#### 4. Can votes be re-used?

A vote from a given account MUST only count against a given election for a given voting contract.

#### 5. Can the result be manipulated?

Votes cannot be forged as a voter needs to sign their vote, specific to a given election and voting smart contract,
with their Ethereum account.

A user submitting votes to the contract can accidentally or voluntarily omit votes.
However, any user can do any number of calls to submit votes to the contract.
Hence, if a user is contesting the result because they are aware of votes that are not yet submitted then they can submit said votes themselves.

If Alice starts an election and Bob wishes for the election result to be _no_.
Bob should vote _no_, aggregate _no_ votes and submit them in a timely fashion with appropriate gas fees to ensure all _no_ votes are recorded.

Neither Alice nor Bob should _wait to see_ which way the election is going (by monitoring the Waku network) before deciding to submit votes.
Indeed, if one wishes to wait the last minute to submit vote then there is a risk that the votes do not get mined, and hence counted, in the blockchain in time.

#### 6. Can Alice stop Bob submitting votes to the contract?

Alice cannot stop Bob submitting votes to the contract that are valid and not yet submitted.
Anyone can submit valid votes to the contract.

#### 7. Can a vote be replaced?

Once a vote is submitted (and mined) to the smart contract, it is not possible to submit another vote cast by the same token holder
(in terms of Ethereum account).

Between the time a vote is published over Waku, and **not** yet mined in the blockchain, the vote could be replaced in several ways:
- By publishing a new vote over Waku, the dApp will replace the most recent vote, allowing voters to change their mind on both the vote value and the token weight that backs the vote,
- By submitting a new vote to the blockchain, before another party submit their previous vote,
- By submitting a new vote to the blockchain with a higher gas fee to race their previous vote in a block.

#### 8. Can a vote be cancelled?

A vote can be replaced as described [above](#7-can-a-vote-be-replaced).

Once a vote is published over the Waku network and another peer received the vote,
there is no control to stop the gossiping of the vote.

Once another user receives the vote, they can submit it to the blockchain.

The only way to annul a vote is to reduce one's token balance to make the vote invalid.

For example, if Alice has 10,000 tokens and votes with all 10,000 tokens on Monday.
She decides to cancel her vote, before it is submitting to the blockchain,
by transferring 1000 tokens out of her account on Tuesday, leaving her account with 9000 tokens.

When Bob submit Alice's vote on Wednesday, the vote will not be valid anymore and will be rejected.
This way, Alice effectively cancelled her vote, as long as her token transfer get mined before the vote submission.

#### 9. Can an election be cancelled or annulled?

It is not possible to cancel or annul an election.

Once an election is started, it will automatically end once the expiry is reached.
The only event that terminates and election is the mining a block with a timestamp greater than the election end.

The election always contains one _yes_ vote from the _election moderator_ meaning that if no vote are submitted to the blockchain then
the "default" result is _yes_.

Participants and moderators must ensure they submit votes early enough,
with appropriate gas fees,
for those votes to be mined before the expiry.

#### 10. When do I need to hold tokens to back my votes?

The token balance of the voters is checked when the votes are mined in the blockchain.
Which means that the voter needs to hold the number of tokens they voted for until the vote is mined.
Failing to doing so could result in the vote being cancelled.

See [8. Can a vote be cancelled?](#8-can-a-vote-be-cancelled) for details.

#### 11. Can a submission of votes fail? If so, what happens?

If Alice attempts to submit multiple votes to the smart contracts and one vote is invalid, then the full transaction will revert and no vote will be submitted
Alice MUST verify that the votes are valid just before submitting them to the blockchain.
**Additionally**, but not instead of, Alice MAY verify that is a vote is valid when receiving it.

A vote may become invalid between reception over Waku and submission to the smart contract because:
- The voter has transferred a number of token out of their account, making the account balance lesser than the vote weight,
- A vote for this voter has already been submitted to the smart contract (whether or not it has the same value).

## WakuConnect Poll SDK

The WakuConnect Poll SDK allows users to create, answer and view polls in a decentralized, censorship-resistant manner.

The polls are published over Waku, there is no interaction with any blockchain, removing gas costs.

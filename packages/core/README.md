# Gassless voting over waku

## Waku Voting

Objects of type of WakuVoting, hold their own Waku objects and also store list of polls and votes for later use.

Creating instance of WakuVoting: 

WakuVoting constructor expects name of DApp and address of a token, also as optional parameter can take custom Waku object.

```ts
    import WakuVoting from 'core'

    const wakuVoting = new WakuVoting('myDapp', '0x00000000000')
```

objects of type WakuVoting expose functions:

createTimedPoll(signer: JsonRpcSigner, question:string, answers: string[], pollType: enum, minToken?: BigNumber, endTime?: number)
getTimedPolls()

sendTimedPollVote(signer: JsonRpcSigner, id: string, selectedAnswer:number, tokenAmount?: number)
getTimedPollVotes(id: string)

## Polls

### Creating time-limited poll

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

### Voting on timed poll

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
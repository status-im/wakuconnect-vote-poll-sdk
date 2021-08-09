#Gassless voting over waku

##Polls

###Creating time-limited poll

To create a poll user has to send a message over waku network on specific topic 

`/{dapp name}/waku-polling/polls-init/proto`

For a poll to be started waku message has to have specific fields:

```proto
message PollInit {
    bytes owner = 1; // Address of a poll owner/initializer
    int64 timestamp = 2; // Timestamp of a waku message
    string question = 3;// Question of a poll
    repeated answers = 4; // Possible answers to poll
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
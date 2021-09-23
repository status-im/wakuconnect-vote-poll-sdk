This package is example usage of WakuPolling 

Example uses usedapp for exposing web3 provider

For using usedapp please see usedapp docs

## creating WakuPolling object

to create waku polling object you can just use react hook

```
const wakuPolling = useWakuPolling(
    appName,
    tokenaddress,
    library,
    multicallAddress
  )
```

it is a good idea for token address and multicall address to be dependent on current chainId.

useWakuPolling creates a new WakuPolling object whenever chainId changes.

## creating new poll

to create new poll you can use `createTimedPoll` function from WakuPolling class

```
wakuPolling.createTimedPoll(
                  question,
                  answers,
                  selectedType,
                  undefined,
                  endTime
                )
```

If you want you can use already created modal component for creating polls 

```
const [showPollCreation, setShowPollCreation] = useState(false)
.
.
.
{showPollCreation && (
        <PollCreation wakuPolling={wakuPolling} setShowPollCreation={setShowPollCreation} theme={theme} />
      )}
```

### showing polls

to show list of polls you can either use `PollList` component from polling-component

```
<PollList wakuPolling={wakuPolling} account={account} theme={theme} />
```

If you want to create your own react component please use 

```
usePollList(wakuPolling: WakuPolling | undefined)
```

Which returns memoized DetailedTimedPoll[] array.

Waku polling also exposes `getDetailedTimedPolls`

```
const DetailedTimedPolls = await wakuPolling.getDetailedTimedPolls()
```
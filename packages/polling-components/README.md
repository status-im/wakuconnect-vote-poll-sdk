This packages contains react components used to display waku polls

## Components

-`Poll` 

Components that displays poll as a card

```
type PollProps = {
  theme: Theme // see react-components theme
  poll: DetailedTimedPoll // see core DetailedTimedPoll
  wakuPolling: WakuPolling | undefined // see core
  signer: Wallet | JsonRpcSigner | undefined
}
```



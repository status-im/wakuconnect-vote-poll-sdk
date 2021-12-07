This packages contains react components used to display waku polls

## Components

-`Poll` 

Components that displays poll as a card

```
type PollProps = {
  theme: Theme // see react-components theme
  poll: DetailedTimedPoll // see core DetailedTimedPoll
  wakuPolling: WakuPolling | undefined // see core
}
```

-`PollCreation`

Modal that creates now polls

```
type PollCreationProps = {
  theme: Theme
  wakuPolling: WakuPolling | undefined
  setShowPollCreation: (val: boolean) => void // function that shows or hides modal
}
```

-`PollList`

A component that shows a list of polls on waku network

```
type PollListProps = {
  theme: Theme
  wakuPolling: WakuPolling | undefined
  account: string | null | undefined
}
```
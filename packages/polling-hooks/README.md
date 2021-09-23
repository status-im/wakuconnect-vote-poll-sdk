Package contains react hooks that help with memoizing values

## hooks

-`usePollList(wakuPolling: WakuPolling | undefined)` returns array of DetailedTimedPoll of polls on waku network

-`useWakuPolling(appName: string, tokenAddress: string, provider: Web3Provider | undefined, multicallAddress: string | undefined)` returns meoized WakuPolling object
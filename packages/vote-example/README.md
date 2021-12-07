Package contains example usage of voting sdk 

For more detailed api please see README in voting-hooks and voting-components

For connecting with web3 api usedapp is used please refer to usedapp docs for more info

## Creating WakuVoting

to create waku voting in react you can use `useWakuVoting` hook from voting-hooks

```
  const waku = useWakuVoting(
    dappName,
    votingContractAddress,
    library,
    multicallAddress
  )
```

For more detailed usage you can take a look in `index.tsx` 

Page is divided into mobile and normal version.

## display list of voting rooms

to display list of voting rooms you can use already created `VotingRoomList` for more details see voting-components package

`VotingRoomList` needs a list of voting room ids which can be gotten with `useVotingRoomsId` hook

```
const votes = useVotingRoomsId(wakuVoting)
<VotingRoomList
    account={account}
    theme={blueTheme}
    wakuVoting={wakuVoting}
    votes={votes}
    availableAmount={tokenBalance}
    mobileOnClick={(votingRoom: VotingRoom) => history.push(`/votingRoom/${votingRoom.id.toString()}`)}
/>
```

## creating new voting room

To create voting room you can use `NewVotingRoomModal` component.

Component is a modal and expects a state value and state update function (`showModal` and `setShowModal`) to be able show and hide modal
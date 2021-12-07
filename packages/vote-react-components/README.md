Package that contains react components for usage with WakuVoting

-`VotingRoomListEmpty` component showing that a list is empty with button. When user is connected button calls `onCreateClick` otherwise call `onConnectClick`.

type VotingRoomListEmptyProps = {
  theme: Theme
  account: string | null | undefined
  onCreateClick: () => void // callback when user is connected
  onConnectClick: () => void // callback when user is not connected
}

-`VoteModal` modal that lets people vote in given voting room.

export interface VoteModalProps {
  setShowModal: (val: boolean) => void // function that sets showModal
  showModal: boolean // when true shows modal
  votingRoom: VotingRoom
  availableAmount: number // amount of tokens user holds
  selectedVote: number // selected vote 0:against 1:for
  wakuVoting: WakuVoting
  theme: Theme
  className?: string // defined to show mobile and tablet versions can be 'mobile' or 'tablet
}

-`VotingRoomList` shows a list with all voting rooms on blockchain

```
type VotingRoomListProps = {
  theme: Theme
  wakuVoting: WakuVoting
  votes: number[] // array of ids of voting rooms to show
  availableAmount: number // available token amount of user
  account: string | null | undefined // address of user account
  mobileOnClick?: (votingRoom: VotingRoom) => void // callback when user clicks voting room card when list is in mobile mode
}
```

-`VotingRoomCard` a card used to show voting room

```
interface VotingRoomCardProps {
  votingRoomId: number // id of voting room to show
  theme: Theme
  availableAmount: number // token balance of current user
  wakuVoting: WakuVoting
  account: string | null | undefined // address of current user
  mobileOnClick?: (votingRoom: VotingRoom) => void // callback when user clicks on card in mobile mode
  CustomVoteModal?: (props: VoteModalProps) => ReactElement // custom react component to show when user clicks on vote for or against
  customAgainstClick?: () => void // custom callback for clicking Against button
  customForClick?: () => void // custom callback for clicking For button
}
```

```
export interface VoteModalProps {
  setShowModal: (val: boolean) => void // function setting state
  showModal: boolean // state defining whether to show modal
  votingRoom: VotingRoom
  availableAmount: number 
  selectedVote: number
  wakuVoting: WakuVoting
  theme: Theme
  className?: string // class name that defines mobile or tablet version
}
```

-`VotingRoomListHeader` a list header with button. When user is connected button calls `onCreateClick` otherwise call `onConnectClick`.

```
type VotingRoomListHeaderProps = {
  theme: Theme
  account: string | null | undefined // address of user account
  onCreateClick: () => void // callback when user is connected
  onConnectClick: () => void // callback when user is not connected
}
```

-`NewVotingRoomModal` modal that lets people create new voting room.

```
type NewVotingRoomModalProps = {
  theme: Theme
  showModal: boolean // state defining whether to show modal
  setShowModal: (val: boolean) => void // function that updates showModal state
  availableAmount: number // token balance of user
  wakuVoting: WakuVoting
}
```

-`NewVotingRoomMobile` component for smaller width screen that allows to create new voting room

```
interface NewVotingRoomMobileProps {
  availableAmount: number // token balance of user
  wakuVoting: WakuVoting
}
```

-`VotingRoomMobile` voting room information for smaller width with ability to vote on given voting room

```
interface VotingRoomMobileProps {
  wakuVoting: WakuVoting
  availableAmount: number // token balance of user
  account: string | null | undefined // address of user account
}
```
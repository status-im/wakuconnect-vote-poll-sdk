Package containing react hooks and components helpers

## hooks

- `useTokenBalance(address: string | null | undefined, wakuVoting: WakuMessaging)` returns memoized token (token address is dervied from waku messaging object)balance of given address

- `useMobileVersion(sizeThreshold: number)` returns true if web browser width is below threshold

- `useRefMobileVersion(myRef: React.RefObject<HTMLHeadingElement>, sizeThreshold: number)` returns true if ref element width is below threshold

## theme 

Some of package components require theme object, package provides 2 themes

```
export type Theme = {
  primaryColor: string
  secondaryColor: string
  activeTextColor: string
  activeBackgroundColor: string
  backgroundColor: string
}

export const orangeTheme: Theme = {
  primaryColor: '#ffb571',
  secondaryColor: '#a53607',
  activeTextColor: '#ffffff',
  activeBackgroundColor: '#f4b77e',
  backgroundColor: '#fbfcfe',
}

export const blueTheme: Theme = {
  primaryColor: '#5d7be2',
  secondaryColor: '#0f3595',
  activeTextColor: '#7e98f4',
  activeBackgroundColor: '#7e98f4',
  backgroundColor: '#f8faff',
}
```

## components

- `Modal` 

Component that overlays over other components

```
type ModalProps = {
  heading: string   // text that shows on top of modal
  children: ReactNode // children to show in modal
  theme: Theme // theme of modal
  setShowModal: (val: boolean) => void // function that changes modal visibility
}
```

- `Input`

Input with a label

```
type InputProps = {
  label: string
  value: string
  onChange: (e: any) => void
  placeholder?: string
}
```

- `TopBar`

stylized topBar component with web3 connect button

```
type TopBarProps = {
  logo: string // logo icon
  title: string
  theme: Theme
  activate: () => void // function that connects web3 provider used if account is undefined
  deactivate: () => void // function that disconnects web3 provider used when account is defined
  account: string | undefined | null // user address
}
```

- `RadioGroup` 

Component that shows a list of radio buttons and only one possible select

```
type RadioGroupProps = {
  options: string[] // list of buttons labels
  setSelectedOption: (option: number) => void // state update function 
  selectedOption: number | undefined // state which holds selectedOption number
}
```

## buttons

Package also contains styled buttons
```Button, SmallButton, ConnectButton, CreateButton, ButtonDisconnect, Account```

## icons

Package contains following icons 

```checkCircleIcon, addIcon, checkIcon, closeIcon, dappIcon, metamaskIcon, statusIcon```

## functions

- `colorRouletteGenerator()`

generator which next function returns color from a roulette

### example usage

```
const colors = colorRouletteGenerator()
const color1 = colors.next().value
const color2 = colors.next().value
const color3 = colors.next().value
```


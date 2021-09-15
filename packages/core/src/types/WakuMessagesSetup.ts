import { WakuMessage } from 'js-waku'

export type WakuMessagesSetup<T> = {
  name: string
  tokenCheckArray: string[]
  decodeFunction: (wakuMessage: WakuMessage) => T | undefined
  filterFunction?: (e: T) => boolean
}

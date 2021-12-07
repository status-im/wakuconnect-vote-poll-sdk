import { useEffect, useState, useRef } from 'react'
import { WakuPolling } from '@dappconnect/vote-poll-sdk-core'
import { Web3Provider } from '@ethersproject/providers'

export function useWakuPolling(
  appName: string,
  tokenAddress: string,
  provider: Web3Provider | undefined,
  multicallAddress: string | undefined
) {
  const [wakuPolling, setWakuPolling] = useState<WakuPolling | undefined>(undefined)
  const queue = useRef(0)
  const queuePos = useRef(0)

  useEffect(() => {
    const createNewWaku = async (queuePosition: number) => {
      while (queuePosition != queuePos.current) {
        await new Promise((r) => setTimeout(r, 1000))
      }
      wakuPolling?.cleanUp()
      if (provider && multicallAddress) {
        const newWakuPoll = await WakuPolling.create(appName, tokenAddress, provider, multicallAddress)
        setWakuPolling(newWakuPoll)
        queuePos.current++
      }
    }
    if (provider) {
      createNewWaku(queue.current++)
    }
    return () => wakuPolling?.cleanUp()
  }, [provider, multicallAddress])
  return wakuPolling
}

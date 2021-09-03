import { useEffect, useState, useRef } from 'react'
import { WakuPolling } from '@status-waku-voting/core'
import { useEthers } from '@usedapp/core'
import { Provider } from '@ethersproject/providers'

export function useWakuPolling(appName: string, tokenAddress: string) {
  const [wakuPolling, setWakuPolling] = useState<WakuPolling | undefined>(undefined)
  const queue = useRef(0)
  const queuePos = useRef(0)

  const { library } = useEthers()
  useEffect(() => {
    const createNewWaku = async (queuePosition: number) => {
      while (queuePosition != queuePos.current) {
        await new Promise((r) => setTimeout(r, 1000))
      }
      wakuPolling?.cleanUp()
      const newWakuPoll = await WakuPolling.create(appName, tokenAddress, library as unknown as Provider)
      setWakuPolling(newWakuPoll)
      queuePos.current++
    }
    if (library) {
      createNewWaku(queue.current++)
    }
    return () => wakuPolling?.cleanUp()
  }, [library])
  return wakuPolling
}

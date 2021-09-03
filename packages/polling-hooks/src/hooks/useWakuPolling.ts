import { useEffect, useState, useRef } from 'react'
import { WakuPolling } from '@status-waku-voting/core'
import { useEthers, useConfig } from '@usedapp/core'
import { Provider } from '@ethersproject/providers'

export function useWakuPolling(appName: string, tokenAddress: string) {
  const [wakuPolling, setWakuPolling] = useState<WakuPolling | undefined>(undefined)
  const queue = useRef(0)
  const queuePos = useRef(0)

  const { library, chainId } = useEthers()
  const config = useConfig()
  useEffect(() => {
    const createNewWaku = async (queuePosition: number) => {
      while (queuePosition != queuePos.current) {
        await new Promise((r) => setTimeout(r, 1000))
      }
      if (library && chainId && config.multicallAddresses && config.multicallAddresses[chainId]) {
        wakuPolling?.cleanUp()
        const newWakuPoll = await WakuPolling.create(
          appName,
          tokenAddress,
          library as unknown as Provider,
          config.multicallAddresses[chainId]
        )
        setWakuPolling(newWakuPoll)
        queuePos.current++
      }
    }
    if (library && chainId) {
      createNewWaku(queue.current++)
    }
    return () => wakuPolling?.cleanUp()
  }, [library])
  return wakuPolling
}

import { useEffect, useState } from 'react'
import { WakuPolling } from '@status-waku-voting/core'

export function useWakuPolling(appName: string, tokenAddress: string) {
  const [wakuPolling, setWakuPolling] = useState<WakuPolling | undefined>(undefined)
  useEffect(() => {
    WakuPolling.create(appName, tokenAddress).then((e) => setWakuPolling(e))
    return () => wakuPolling?.cleanUp()
  }, [])
  return wakuPolling
}

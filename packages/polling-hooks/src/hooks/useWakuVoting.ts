import { useEffect, useState } from 'react'
import WakuVoting from '@status-waku-voting/core'

export function useWakuVoting(appName: string, tokenAddress: string) {
  const [wakuVoting, setWakuVoting] = useState<WakuVoting | undefined>(undefined)
  useEffect(() => {
    WakuVoting.create(appName, tokenAddress).then((e) => setWakuVoting(e))
  }, [])
  return wakuVoting
}

import { WakuVoting } from '@status-waku-voting/core'
import React, { useEffect, useRef, useState } from 'react'
import { Web3Provider } from '@ethersproject/providers'

export function useWakuProposal(
  appName: string,
  contractAddress: string,
  provider: Web3Provider | undefined,
  multicallAddress: string | undefined
) {
  const [waku, setWaku] = useState<WakuVoting | undefined>(undefined)
  const queuePos = useRef(0)
  const queueSize = useRef(0)
  useEffect(() => {
    ;(window as any).ethereum.on('chainChanged', () => window.location.reload())
    const createWaku = async (queue: number) => {
      while (queue != queuePos.current) {
        await new Promise((r) => setTimeout(r, 1000))
      }
      if (provider && multicallAddress) {
        const wak = await WakuVoting.create(appName, contractAddress, provider, multicallAddress)
        setWaku(wak)
      }
      queuePos.current++
    }
    createWaku(queueSize.current++)

    return () => (window as any).ethereum.removeListener('chainChanged', () => window.location.reload())
  }, [provider, multicallAddress, contractAddress])

  return waku
}

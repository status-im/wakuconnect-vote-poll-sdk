import { WakuVoting } from '@status-waku-voting/core'
import React, { useEffect, useState } from 'react'
import { Web3Provider } from '@ethersproject/providers'

export function useWakuProposal(
  appName: string,
  contractAddress: string,
  provider: Web3Provider | undefined,
  multicallAddress: string | undefined
) {
  const [waku, setWaku] = useState<WakuVoting | undefined>(undefined)

  useEffect(() => {
    ;(window as any).ethereum.on('chainChanged', () => window.location.reload())
    const createWaku = async () => {
      if (provider && multicallAddress) {
        const wak = await WakuVoting.create(appName, contractAddress, provider, multicallAddress)
        setWaku(wak)
      }
    }
    createWaku()

    return () => (window as any).ethereum.removeListener('chainChanged', () => window.location.reload())
  }, [provider, multicallAddress, contractAddress])

  return waku
}

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
  const [chainId, setChainId] = useState(0)

  useEffect(() => {
    const updateChainId = async () => {
      const network = await provider?.getNetwork()
      setChainId(network?.chainId ?? 0)
    }
    ;(window as any)?.ethereum?.on('chainChanged', updateChainId)
    return () => (window as any)?.ethereum?.removeListener('chainChanged', updateChainId)
  }, [])

  useEffect(() => {
    const createWaku = async (queue: number) => {
      while (queue != queuePos.current) {
        await new Promise((r) => setTimeout(r, 1000))
      }
      if (provider && multicallAddress) {
        if (waku) {
          waku.cleanUp()
        }
        try {
          const wak = await WakuVoting.create(appName, contractAddress, provider, multicallAddress)
          setWaku(wak)
        } catch {
          setWaku(undefined)
        }
      } else {
        setWaku(undefined)
      }
      queuePos.current++
    }
    createWaku(queueSize.current++)
  }, [provider, multicallAddress, contractAddress, chainId])

  return waku
}

import { WakuVoting } from '@status-waku-voting/core'
import React, { useEffect, useState } from 'react'
import { providers } from 'ethers'

export function useWakuProposal() {
  ;(window as any).ethereum.on('chainChanged', () => window.location.reload())
  const [waku, setWaku] = useState<WakuVoting | undefined>(undefined)

  useEffect(() => {
    const createWaku = async () => {
      const provider = new providers.Web3Provider((window as any).ethereum)
      const wak = await WakuVoting.create(
        'test',
        '0x5795A64A70cde4073DBa9EEBC5C6b675B15C815a',
        provider,
        '0x53c43764255c17bd724f74c4ef150724ac50a3ed'
      )
      setWaku(wak)
    }
    createWaku()
  }, [])

  return waku
}

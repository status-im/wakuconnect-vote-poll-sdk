import { WakuMessaging } from '@waku/vote-poll-sdk-core'
import { BigNumber } from 'ethers'
import { useEffect, useState } from 'react'

export function useTokenBalance(address: string | null | undefined, wakuVoting: WakuMessaging) {
  const [tokenBalance, setTokenBalance] = useState(0)

  useEffect(() => {
    const updateBalances = async () => {
      if (address) {
        const tokenDecimals = wakuVoting.tokenDecimals
        if (tokenDecimals) {
          const balance = (await wakuVoting.getTokenBalance(address))?.div(BigNumber.from(10).pow(tokenDecimals))
          if (balance && !balance.eq(tokenBalance)) {
            setTokenBalance(balance.toNumber())
          }
        }
      }
    }
    setTimeout(updateBalances, 1000)
    const interval = setInterval(updateBalances, 10000)
    return () => clearInterval(interval)
  }, [address])

  return tokenBalance
}

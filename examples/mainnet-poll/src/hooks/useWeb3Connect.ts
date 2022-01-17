import { useCallback, useEffect, useState } from 'react'
import { Web3Provider } from '@ethersproject/providers'
import { providers } from 'ethers'

export function useWeb3Connect(supportedChain: number) {
  const [provider, setProvider] = useState<Web3Provider | undefined>(undefined)
  const [account, setAccount] = useState<string | undefined>(undefined)

  useEffect(() => {
    const handleChainIdChange = async () => {
      const ethProvider = new providers.Web3Provider((window as any).ethereum)
      const _chainId = (await ethProvider.getNetwork()).chainId
      if (_chainId === supportedChain) {
        setProvider(ethProvider)
      } else {
        setProvider(undefined)
        deactivate()
      }
    }
    try {
      ;(window as any).ethereum.on('chainChanged', handleChainIdChange)
      handleChainIdChange()
    } catch {
      return
    }
    return () => {
      try {
        ;(window as any).ethereum.off('chainChanged', handleChainIdChange)
      } catch {
        return
      }
    }
  }, [])

  const changeSigner = useCallback(async () => {
    if (provider) {
      if ((await provider.listAccounts()).length > 0) {
        const _signer = provider?.getSigner()
        setAccount(await _signer.getAddress())
        return
      }
    }
    deactivate()
  }, [provider])

  const activate = useCallback(async () => {
    if (provider) {
      try {
        await provider.send('eth_requestAccounts', [])
        changeSigner()
        ;(window as any).ethereum.on('accountsChanged', changeSigner)
      } catch {
        deactivate()
      }
    }
  }, [provider])

  const deactivate = useCallback(() => {
    setAccount(undefined)
    try {
      ;(window as any).ethereum.off('accountsChanged', changeSigner)
    } catch {
      return
    }
  }, [])

  return { activate, deactivate, account, provider }
}

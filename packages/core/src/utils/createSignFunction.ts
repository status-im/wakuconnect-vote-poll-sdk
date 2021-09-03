import { JsonRpcSigner } from '@ethersproject/providers'
import { Wallet } from 'ethers'

export function createSignFunction(signer: JsonRpcSigner | Wallet) {
  return async (params: string[]) => {
    if ('send' in signer.provider) {
      try {
        const signature = await signer.provider.send('eth_signTypedData_v4', params)
        if (signature) {
          return signature
        }
      } catch {
        return undefined
      }
    }
    return undefined
  }
}

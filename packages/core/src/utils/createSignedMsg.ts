import { JsonRpcSigner } from '@ethersproject/providers'
import { Wallet } from 'ethers'

export function createSignedMsg(signer: JsonRpcSigner | Wallet) {
  return async <T>(msg: any, params: string[], Class: new (sig: string, msg: any) => T): Promise<T | undefined> => {
    if ('send' in signer.provider) {
      try {
        const signature = await signer.provider.send('eth_signTypedData_v4', params)
        if (signature) {
          return new Class(signature, msg)
        }
      } catch {
        return undefined
      }
    }
    return undefined
  }
}

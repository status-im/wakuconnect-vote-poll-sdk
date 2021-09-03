import { recoverTypedSignature_v4 } from 'eth-sig-util'
import { utils } from 'ethers'

export function verifySignature(params: any, address: string) {
  try {
    const verifiedAddress = utils.getAddress(recoverTypedSignature_v4(params))
    if (!verifiedAddress || verifiedAddress != address) {
      return false
    }
    return true
  } catch {
    return false
  }
}

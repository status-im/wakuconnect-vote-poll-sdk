import { ethers } from 'ethers'
import { deployContract } from 'ethereum-waffle'
import { MultiCall } from '../abi'

const deploy = async () => {
    const providerName = process.env.ETHEREUM_PROVIDER
    const privateKey = process.env.ETHEREUM_PRIVATE_KEY
    console.log(privateKey)
    
    if (privateKey && providerName) {
        console.log(`deploying on ${providerName}`)
        const provider = ethers.getDefaultProvider(process.env.ETHEREUM_PROVIDER)
        const wallet = new ethers.Wallet(privateKey, provider)

        const multiCall = await deployContract(wallet, MultiCall)
        console.log(`MultiCall deployed with address: ${multiCall.address}`)
    }
}

deploy()


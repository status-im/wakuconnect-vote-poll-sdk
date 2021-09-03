import { ethers } from 'ethers'
import { deployContract } from 'ethereum-waffle'
import { VotingContract } from '../abi'

const deploy = async () => {
    const providerName = process.env.ETHEREUM_PROVIDER
    const privateKey = process.env.ETHEREUM_PRIVATE_KEY
    console.log(privateKey)
    
    if (privateKey && providerName) {
        console.log(`deploying on ${providerName}`)
        const provider = ethers.getDefaultProvider(process.env.ETHEREUM_PROVIDER)
        const wallet = new ethers.Wallet(privateKey, provider)

        const votingContract = await deployContract(wallet, VotingContract,[process.env.ETHEREUM_TOKEN_ADDRESS])
        console.log(`Voting contract deployed with address: ${votingContract.address}`)

    }
}

deploy()


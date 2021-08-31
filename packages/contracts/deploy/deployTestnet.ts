import { BigNumber, ethers } from 'ethers'
import { deployContract } from 'ethereum-waffle'
import {VotingContract, Directory, ERC20Mock} from '../abi'

const deploy = async () => {
    const providerName = process.env.ETHEREUM_PROVIDER
    const privateKey = process.env.ETHEREUM_PRIVATE_KEY
    console.log(privateKey)
    
    if (privateKey && providerName) {
        console.log(`deploying on ${providerName}`)
        const provider = ethers.getDefaultProvider(process.env.ETHEREUM_PROVIDER)
        const wallet = new ethers.Wallet(privateKey, provider)

        const ercArgs = ['MSNT', 'Mock SNT', wallet.address, BigNumber.from('0x33B2E3C9FD0803CE8000000')]
        const erc20 = await deployContract(wallet,ERC20Mock,ercArgs)
        console.log(`ERC20 Token deployed with address: ${erc20.address}`)

        const votingContract = await deployContract(wallet, VotingContract,[erc20.address])
        console.log(`Voting contract deployed with address: ${votingContract.address}`)
    }
}

deploy()


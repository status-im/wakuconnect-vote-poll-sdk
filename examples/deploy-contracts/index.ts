import {ContractFactory, Wallet, getDefaultProvider} from 'ethers';
import VotingContract from '@waku/vote-sdk-contracts/build/VotingContract.json';
import readline from 'readline';
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const prompt = (query:string) => new Promise(resolve => rl.question(query, resolve));

try{
    const privateKey = process.argv[2];
    const providerName = process.argv[3];
    const tokenAddress = process.argv[4];
    const voteDuration = process.argv[5];
    const provider = getDefaultProvider(providerName)
    const wallet = new Wallet(privateKey,provider)
    const contract = ContractFactory.fromSolidity(VotingContract,wallet)

    new Promise(async () => {
        console.log("\x1b[1m")
        console.log(`You are about to deploy a voting smart contract\n`);
        console.log(`Wallet address: \t${wallet.address}\n`);
        console.log(`Provider name: \t\t${provider.network.name}\n`);
        console.log(`Provider chainID: \t${provider.network.chainId}\n`);
        console.log(`Token address to use: \t${tokenAddress}\n`);
        console.log(`Vote duration: \t\t${voteDuration ?? 1000} seconds\n`);
        console.log('Please verify that above parameters are correct')
        console.log('WARNING: this operation WILL use ether')
        const answer = await prompt('If you are sure that you want to continue write [yes]:')
        if(answer === 'yes' || answer === 'Yes'){
            const deployedContract = await contract.deploy(tokenAddress, voteDuration ?? 1000)
            console.log(`contract deployed with address ${deployedContract.address}`)
        } else {
            console.log('Aborted')
        }
        rl.close()
    })
} catch {
    console.log('Error creating smart contract');
    rl.close()
}
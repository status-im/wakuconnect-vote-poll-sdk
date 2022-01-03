# Mainnet WakuConnect Poll SDK Example

```
yarn
yarn start
```

Then go to https://localhost:8181/

To create or answer a poll, you need to hold SNT token by default on mainnet.

To create or answer a poll, you will need to sign a message with your wallet.

If you do not hold SNT tokens, you can use this demo app with any other mainnet ERC20 token,
just pass the token contract address to the `token` query parameter.

For example, for DAI:

https://localhost:8181/?token=0x6B175474E89094C44Da98b954EedeAC495271d0F?a=0x93c0c3076f3a08e4671c84c31f1f80d2abd03dd5

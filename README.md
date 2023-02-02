# PROJECT Charity Raffle Overview

The CharityRaffle contract uses [Chainlink VRF](https://docs.chain.link/vrf/v2/introduction/) and [Chainlink Automation](https://docs.chain.link/chainlink-automation/introduction/).

You will need to have the native token for the blockchain test network you use. This project is configured to be deployed and run on the Avalanche Fuji testnet, but you can deploy the code on any EVM network that is [supported by Chainlink](https://docs.chain.link/chainlink-automation/supported-networks/)

## Getting started

- Install the NPM packages
- Fill in the Environment Variables needed in `hardhat.config.js` to connect your wallet, and other API keys.
- Run `npx hardhat test` to run the tests.
- Run `npx hardhat` to see the Hardhat Tasks available. The task: `deploy-charityRaffle` has been included in `hardhat.config.js`

## Tooling used

- Hardhat
- JavaScript/ NodeJs
- Metamask Browser Wallet
- Avalanche Fuji Network
- Chainlink Decentralized Oracle Services

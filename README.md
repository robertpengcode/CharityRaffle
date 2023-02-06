# Project Charity Raffle Overview

The contract owner/admin can create a raffle event for a charity. The raffle has an expired time. Before the expired time buyers can enter the raffle with the fixed ticket price 0.001 ETH.

When the raffle expires Chainlink Automation will kick in and call Chainlink VRF to generate a random number for the contract to pick up a winner. After the winner is picked anyone can call the contract to pay the charity and the winner. The charity and the winner will receive 45% of the balance each. After the charity and the winner are paid the owner/admin can call withdraw to get 10% of the balance. The raffle will be reset to an empty raffle.

The owner/admin can create another raffle to start the process allover again.

The CharityRaffle contract uses [Chainlink VRF](https://docs.chain.link/vrf/v2/introduction/) and [Chainlink Automation](https://docs.chain.link/chainlink-automation/introduction/).

You will need to have the native token for the blockchain test network you use. This project is configured to be deployed and run on the Avalanche Fuji testnet, but you can deploy the code on any EVM network that is [supported by Chainlink](https://docs.chain.link/chainlink-automation/supported-networks/)

You will need to subscript Chainlink VRF by adding the contract to consumers. You will also need to register a new Upkeep at Chainlink Automation.

## Getting started

- Install the NPM packages
- Fill in the Environment Variables needed in `hardhat.config.js` to connect your wallet, and other API keys.
- Run `npx hardhat test` to run the tests.
- Run `npx hardhat` to see the Hardhat Tasks available. The task: `deploy-charityRaffle` has been included in `hardhat.config.js`

## Tooling used

Backend:

- Hardhat
- JavaScript/ NodeJs
- Metamask Browser Wallet
- Avalanche Fuji Network
- Chainlink Decentralized Oracle Services

React Frontend:

- react-bootstrap
- ethers

Next.js Frontend:

- react-moralis
- web3uikit
- tailwindcss

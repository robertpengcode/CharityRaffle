const { ethers, network } = require("hardhat");
const { assert } = require("chai");
const testnetConfigs = require("../testnets.config");
const chainId = network.config.chainId;
const isLocalHostNetwork = chainId == 31337;

isLocalHostNetwork
  ? describe.skip
  : describe("CharityRaffle Staging Tests on Fuji", () => {
      const subscriptionId = testnetConfigs[chainId].subscriptionId;
      const vrfCoordinatorAddress = testnetConfigs[chainId].coordinatorAddress;
      let deployer, charityRaffleContract;

      before(async () => {
        [deployer] = await ethers.getSigners();
        const CharityRaffleFactory = await ethers.getContractFactory(
          "CharityRaffle"
        );
        charityRaffleContract = await CharityRaffleFactory.connect(
          deployer
        ).deploy(subscriptionId, vrfCoordinatorAddress);
      });

      describe("Simple Check", () => {
        it("allows owner to create charity raffle", async () => {
          const response1 = await charityRaffleContract.createRaffle(
            "0x5d0dA0E8C842Fcb9515Be77f9B7822A7617aBd40",
            "testText",
            60
          );
          await response1.wait(1);
          const charityAddr = (await charityRaffleContract.getRaffleInfo())[0];
          assert.equal(
            charityAddr,
            "0x5d0dA0E8C842Fcb9515Be77f9B7822A7617aBd40"
          );
        });
      });
    });

const { ethers, network } = require("hardhat");
const { expect } = require("chai");

const chainId = network.config.chainId;
const isLocalHostNetwork = chainId == 31337;

!isLocalHostNetwork
  ? describe.skip
  : describe("CharityRaffle Unit Tests", () => {
      let VRFCoordinatorV2Mock,
        subscriptionId,
        vrfCoordinatorAddress,
        deployer,
        charity,
        buyer1,
        buyer2,
        charityRaffleContract;

      const interval = 60; //seconds
      const ticketPrice = ethers.utils.parseEther("0.001");

      before(async () => {
        // Deploy VRF Cooridinator Mock.
        /**
         * @dev Read more at https://docs.chain.link/docs/chainlink-vrf/
         */
        const BASE_FEE = "100000000000000000";
        const GAS_PRICE_LINK = "1000000000"; // 0.000000001 LINK per gas
        const FUND_AMOUNT = "1000000000000000000"; // 1 eth.

        const VRFCoordinatorV2MockFactory = await ethers.getContractFactory(
          "VRFCoordinatorV2Mock"
        );
        VRFCoordinatorV2Mock = await VRFCoordinatorV2MockFactory.deploy(
          BASE_FEE,
          GAS_PRICE_LINK
        );
        vrfCoordinatorAddress = VRFCoordinatorV2Mock.address;

        const transaction = await VRFCoordinatorV2Mock.createSubscription();
        const transactionReceipt = await transaction.wait(1);
        subscriptionId = ethers.BigNumber.from(
          transactionReceipt.events[0].topics[1]
        );

        await VRFCoordinatorV2Mock.fundSubscription(
          subscriptionId,
          FUND_AMOUNT
        );

        //Deploy CharityRaffle
        [deployer, charity, buyer1, buyer2] = await ethers.getSigners();

        const CharityRaffleFactory = await ethers.getContractFactory(
          "CharityRaffle"
        );
        charityRaffleContract = await CharityRaffleFactory.connect(
          deployer
        ).deploy(subscriptionId, vrfCoordinatorAddress);

        await VRFCoordinatorV2Mock.addConsumer(
          subscriptionId,
          charityRaffleContract.address
        );
      });

      describe("Create charity raffle", () => {
        it("Should not create raffle - not owner", async () => {
          await expect(
            charityRaffleContract
              .connect(buyer1)
              .createRaffle(charity.address, "testText", interval)
          ).to.be.revertedWith("Only callable by owner");
        });

        it("Should create raffle - emit event", async () => {
          await expect(
            charityRaffleContract.createRaffle(
              charity.address,
              "testText",
              interval
            )
          ).to.emit(charityRaffleContract, "RaffleCreated");
        });

        it("Should not create raffle - exists already", async () => {
          await expect(
            charityRaffleContract.createRaffle(
              charity.address,
              "testText",
              interval
            )
          ).to.be.revertedWithCustomError(
            charityRaffleContract,
            "Raffle_NotEmpty"
          );
        });
      });

      describe("Buy charity raffle", () => {
        it("Should not buy raffle - fund is not ticket price", async () => {
          await expect(
            charityRaffleContract.connect(buyer1).buyRaffle()
          ).to.be.revertedWithCustomError(
            charityRaffleContract,
            "Raffle_NotTicketPrice"
          );
        });

        it("Should buy raffle - emit event", async () => {
          await expect(
            charityRaffleContract.connect(buyer1).buyRaffle({
              value: ticketPrice,
            })
          ).to.emit(charityRaffleContract, "RaffleBought");
        });

        it("Should add to players", async () => {
          await charityRaffleContract.connect(buyer2).buyRaffle({
            value: ticketPrice,
          });
          await charityRaffleContract.buyRaffle({
            value: ticketPrice,
          });
          const players = (await charityRaffleContract.getRaffleInfo())[4];
          expect(players.length).to.equal(3);
        });

        it("Should add to balance", async () => {
          const balance = (await charityRaffleContract.getRaffleInfo())[6];
          expect(balance).to.equal(ticketPrice * 3);
        });

        it("Should not buy raffle - time expired", async () => {
          await network.provider.send("evm_increaseTime", [interval + 1]);
          await network.provider.request({ method: "evm_mine", params: [] });
          await expect(
            charityRaffleContract.buyRaffle({
              value: ticketPrice,
            })
          ).to.be.revertedWithCustomError(
            charityRaffleContract,
            "Raffle_Expired"
          );
        });

        it("Should change status to CALCULATING", async () => {
          await charityRaffleContract.performUpkeep("0x");
          const status = (await charityRaffleContract.getRaffleInfo())[3];
          expect(status).to.equal(1);
        });
      });

      describe("Chainlink fulfillRandomWords", () => {
        it("Should emit event", async () => {
          const requestId = await charityRaffleContract.lastRequestId();
          await expect(
            VRFCoordinatorV2Mock.fulfillRandomWords(
              requestId,
              charityRaffleContract.address
            )
          ).to.emit(charityRaffleContract, "RequestFulfilled");
        });

        it("Should change status to END", async () => {
          const status = (await charityRaffleContract.getRaffleInfo())[3];
          expect(status).to.equal(2);
        });

        it("Should have a winner", async () => {
          const winner = (await charityRaffleContract.getRaffleInfo())[5];
          const winnerTest = winner.slice(0, 7);
          expect(winnerTest).to.not.equal("0x00000");
        });
      });

      describe("Payment to Charity & Winner", () => {
        it("Should update Charity's and Winner's balances", async () => {
          const winner = (await charityRaffleContract.getRaffleInfo())[5];
          const balance = (await charityRaffleContract.getRaffleInfo())[6];
          await expect(
            charityRaffleContract.makePayments()
          ).to.changeEtherBalances(
            [charity.address, winner],
            [balance * 0.45, balance * 0.45]
          );
        });
        // it("Should pay - emit event", async () => {
        //   await expect(charityRaffleContract.makePayments()).to.emit(
        //     charityRaffleContract,
        //     "RafflePaid"
        //   );
        // });
        it("Should change status to PAID", async () => {
          const status = (await charityRaffleContract.getRaffleInfo())[3];
          expect(status).to.equal(3);
        });
      });

      describe("Owner withdraw balance", () => {
        it("Should not withdraw - emit event", async () => {
          await expect(
            charityRaffleContract.connect(buyer1).withdrawBalance()
          ).to.be.revertedWith("Only callable by owner");
        });
        // it("Should withdraw - emit event", async () => {
        //   await expect(charityRaffleContract.withdrawBalance()).to.emit(
        //     charityRaffleContract,
        //     "RaffleWithdrew"
        //   );
        // });
        it("Should update owner's and contract's balances", async () => {
          const contractBalance =
            await charityRaffleContract.getContractBalance();
          await expect(
            charityRaffleContract.withdrawBalance()
          ).to.changeEtherBalances(
            [deployer, charityRaffleContract.address],
            [contractBalance, -contractBalance]
          );
        });

        it("Should change status to OPEN", async () => {
          const status = (await charityRaffleContract.getRaffleInfo())[3];
          expect(status).to.equal(0);
        });
      });

      describe("Delete charity raffle", () => {
        before(async () => {
          await charityRaffleContract.createRaffle(
            charity.address,
            "testText",
            interval
          );
          await charityRaffleContract.connect(buyer1).buyRaffle({
            value: ticketPrice,
          });
          await charityRaffleContract.connect(buyer2).buyRaffle({
            value: ticketPrice,
          });
        });

        it("Should not delete raffle - not owner", async () => {
          await expect(
            charityRaffleContract.connect(buyer1).deleteRaffle()
          ).to.be.revertedWith("Only callable by owner");
        });

        it("Should refund players", async () => {
          await expect(
            charityRaffleContract.deleteRaffle()
          ).to.changeEtherBalances(
            [buyer1.address, buyer2.address],
            [ticketPrice, ticketPrice]
          );
        });

        it("Should delete raffle - emit event", async () => {
          await charityRaffleContract.createRaffle(
            charity.address,
            "testText2",
            interval
          );
          await expect(charityRaffleContract.deleteRaffle()).to.emit(
            charityRaffleContract,
            "RaffleDeleted"
          );
        });
      });
    });

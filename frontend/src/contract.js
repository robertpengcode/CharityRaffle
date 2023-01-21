import { ethers } from "ethers";

const provider = new ethers.providers.Web3Provider(window.ethereum);
const charityRaffleAddress = "0x157809385776e6BE59548Ba73Ea7dde6ED686829";
const charityRaffleAbi = [
  "constructor(uint64 subscriptionId)",
  "error OnlyCoordinatorCanFulfill(address have, address want)",
  "error Raffle_CannotDelete()",
  "error Raffle_Expired()",
  "error Raffle_NotEmpty()",
  "error Raffle_NotEnded()",
  "error Raffle_NotOpen()",
  "error Raffle_NotPaid()",
  "error Raffle_NotTicketPrice()",
  "error Raffle_UpkeepNotNeeded(uint256 status, uint256 numOfPlayers, uint256 endTime)",
  "event OwnershipTransferRequested(address indexed from, address indexed to)",
  "event OwnershipTransferred(address indexed from, address indexed to)",
  "event RaffleBought(address indexed buyer, uint256 timeStamp)",
  "event RaffleCreated(address indexed charity, uint256 createTime, uint256 endTime)",
  "event RaffleDeleted(address indexed owner, uint256 timeStemp)",
  "event RafflePaid(address indexed charity, uint256 toCharity, address indexed winner, uint256 toWinner, uint256 timeStamp)",
  "event RaffleWithdrew(address indexed owner, uint256 timeStemp)",
  "event RequestFulfilled(uint256 requestId, uint256[] randomWords)",
  "function acceptOwnership() @29000000",
  "function buyRaffle() payable @29000000",
  "function checkUpkeep(bytes) view returns (bool upkeepNeeded, bytes performData) @29000000",
  "function createRaffle(address charityAddr, string description, uint256 interval) @29000000",
  "function deleteRaffle() @29000000",
  "function getAdmin() view returns (address) @29000000",
  "function getCharity() view returns (address, string) @29000000",
  "function getContractBalance() view returns (uint256) @29000000",
  "function getRaffleInfo() view returns (address, string, uint256, uint8, address[], address, uint256) @29000000",
  "function getWinner() view returns (address) @29000000",
  "function makePayments() @29000000",
  "function owner() view returns (address) @29000000",
  "function performUpkeep(bytes performData) @29000000",
  "function rawFulfillRandomWords(uint256 requestId, uint256[] randomWords) @29000000",
  "function ticketPrice() view returns (uint256) @29000000",
  "function transferOwnership(address to) @29000000",
  "function withdrawBalance() @29000000",
];

export const connect = async () => {
  await provider.send("eth_requestAccounts", []);
  return getContract();
};

export const getContract = async () => {
  const signer = provider.getSigner();
  const charityRaffleContract = new ethers.Contract(
    charityRaffleAddress,
    charityRaffleAbi,
    signer
  );
  return { contract: charityRaffleContract, signer: signer };
};

import { ethers } from "ethers";

const provider = new ethers.providers.Web3Provider(window.ethereum);
const charityRaffleAddress = "0x131C7cf039725821771397C93B75E2e105DC72DC";
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
  "function acceptOwnership()",
  "function buyRaffle() payable",
  "function checkUpkeep(bytes) view returns (bool upkeepNeeded, bytes performData)",
  "function createRaffle(address charityAddr, string description, uint256 interval)",
  "function deleteRaffle()",
  "function getAdmin() view returns (address)",
  "function getCharity() view returns (address, string)",
  "function getContractBalance() view returns (uint256)",
  "function getRaffleInfo() view returns (address, string, uint256, uint8, address[], address, uint256)",
  "function getWinner() view returns (address)",
  "function makePayments()",
  "function owner() view returns (address)",
  "function performUpkeep(bytes performData)",
  "function rawFulfillRandomWords(uint256 requestId, uint256[] randomWords)",
  "function ticketPrice() view returns (uint256)",
  "function transferOwnership(address to)",
  "function withdrawBalance()",
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

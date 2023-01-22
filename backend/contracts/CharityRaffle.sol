// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import "@chainlink/contracts/src/v0.8/ConfirmedOwner.sol";
import "@chainlink/contracts/src/v0.8/AutomationCompatible.sol";

contract CharityRaffle is VRFConsumerBaseV2, ConfirmedOwner, AutomationCompatibleInterface {
    enum RaffleStatus {
        OPEN,
        CALCULATING,
        END,
        PAID
    }
    struct Raffle {
        address charityAddr;
        string description;
        uint256 endTime;
        RaffleStatus raffleStatus;
        address[] players;
        address winner;
        uint256 balance;
    }

    uint256 public immutable ticketPrice = 0.001 ether;
    address admin;
    Raffle raffle;

    //below for Chainlink VRF
    VRFCoordinatorV2Interface COORDINATOR;
    uint64 s_subscriptionId;
    //key hash for gas lane
    bytes32 keyHash =
        //https://docs.chain.link/vrf/v2/subscription/supported-networks#avalanche-fuji-testnet
        0x354d2f95da55398f44b7cff77da56283d9c6c829a4bdf1bbcaf2ad6a4d081f61;
    uint32 callbackGasLimit = 100000;
    uint16 requestConfirmations = 3;
    uint32 numWords = 1;
    /**
     * Avalanche Fuji testnet
     * COORDINATOR: 0x2eD832Ba664535e5886b75D64C46EB9a228C2610
     */
    event RequestFulfilled(uint256 requestId, uint256[] randomWords);
    event RaffleCreated(address indexed charity, uint256 createTime, uint256 endTime);
    event RaffleBought(address indexed buyer, uint256 timeStamp);
    event RafflePaid(address indexed charity, uint256 toCharity, address indexed winner, uint256 toWinner, uint256 timeStamp);
    event RaffleWithdrew(address indexed owner, uint256 timeStemp);
    event RaffleDeleted(address indexed owner, uint256 timeStemp);

    error Raffle_Expired();
    error Raffle_NotEmpty();
    error Raffle_NotOpen();
    error Raffle_NotTicketPrice();
    error Raffle_UpkeepNotNeeded(uint256 status, uint256 numOfPlayers, uint256 endTime);
    error Raffle_NotEnded();
    error Raffle_NotPaid();
    error Raffle_CannotDelete();

    constructor(
        uint64 subscriptionId
    )
        VRFConsumerBaseV2(0x2eD832Ba664535e5886b75D64C46EB9a228C2610)
        ConfirmedOwner(msg.sender)
    {
        COORDINATOR = VRFCoordinatorV2Interface(
            0x2eD832Ba664535e5886b75D64C46EB9a228C2610
        );
        s_subscriptionId = subscriptionId;
        admin = msg.sender;
    }

    function createRaffle(address charityAddr, string calldata description, uint256 interval) external onlyOwner{
        if (raffle.charityAddr != address(0)) {
            revert Raffle_NotEmpty();
        }
        raffle.charityAddr = charityAddr;
        raffle.description = description;
        raffle.endTime = block.timestamp + interval;
        emit RaffleCreated(charityAddr, block.timestamp, raffle.endTime);
    }

    function buyRaffle() external payable {
        if (msg.value != ticketPrice) {
            revert Raffle_NotTicketPrice();
        }
        if (block.timestamp > raffle.endTime) {
            revert Raffle_Expired();
        }
        if (raffle.raffleStatus != RaffleStatus.OPEN) {
            revert Raffle_NotOpen();
        }
        raffle.players.push(msg.sender);
        raffle.balance += msg.value;
        emit RaffleBought(msg.sender, block.timestamp);
    }

     function checkUpkeep(
        bytes calldata /* checkData */
    )
        public
        view
        override
        returns (bool upkeepNeeded, bytes memory performData )
    {
        bool isOpen = raffle.raffleStatus == RaffleStatus.OPEN;
        bool hasPlayers = raffle.players.length > 0;
        bool timePassed = block.timestamp > raffle.endTime;
        upkeepNeeded = isOpen && hasPlayers && timePassed;
    }

    function performUpkeep(bytes calldata performData) external override {
        (bool UpkeepNeeded, ) = checkUpkeep(performData);
        if(!UpkeepNeeded) {
            revert Raffle_UpkeepNotNeeded(uint256(raffle.raffleStatus), raffle.players.length, raffle.endTime);
        }
        raffle.raffleStatus = RaffleStatus.CALCULATING;
        COORDINATOR.requestRandomWords(
            keyHash,
            s_subscriptionId,
            requestConfirmations,
            callbackGasLimit,
            numWords
        );
    }

    function fulfillRandomWords(
        uint256 _requestId,
        uint256[] memory _randomWords
    ) internal override {
        emit RequestFulfilled(_requestId, _randomWords);
        uint256 randomNum = _randomWords[0];
        uint256 winnerIdex = randomNum % raffle.players.length;
        raffle.winner = raffle.players[winnerIdex];
        raffle.raffleStatus = RaffleStatus.END;
    }

    function makePayments() external {
        if (raffle.raffleStatus != RaffleStatus.END) {
            revert Raffle_NotEnded();
        }
        uint256 toCharity = (raffle.balance * 45) / 100;
        uint256 toWinner = (raffle.balance * 45) / 100;
        raffle.balance = 0;
        (bool sentCharity,) = payable(raffle.charityAddr).call{value: toCharity}("");
        require(sentCharity, "sent to charity failed");
        (bool sentWinner,) = payable(raffle.winner).call{value: toWinner}("");
        require(sentWinner, "sent to winner failed");
        raffle.raffleStatus = RaffleStatus.PAID;
        emit RafflePaid(raffle.charityAddr, toCharity, raffle.winner, toWinner, block.timestamp);
    }

    function withdrawBalance() external onlyOwner{
        if (raffle.raffleStatus != RaffleStatus.PAID) {
            revert Raffle_NotPaid();
        }
        uint256 balance = address(this).balance;
        (bool sentOwner, ) = payable(msg.sender).call{value: balance}("");
        require(sentOwner, "sent balance failed");
        delete raffle;
        emit RaffleWithdrew(msg.sender, block.timestamp);
    }

    function deleteRaffle() external onlyOwner{
        // if (raffle.players.length > 0) {
        //     revert Raffle_CannotDelete();
        // }
        delete raffle;
        emit RaffleDeleted(msg.sender, block.timestamp);
    }

    function getAdmin() external view returns(address) {
        return admin;
    }

    function getCharity() external view returns(address, string memory) {
        return (raffle.charityAddr, raffle.description);
    }

    function getWinner() external view returns(address) {
        return raffle.winner;
    }

    function getRaffleInfo() external view returns(address, string memory, uint256, RaffleStatus, address[] memory, address, uint256) {
        return(raffle.charityAddr, raffle.description, raffle.endTime, raffle.raffleStatus, raffle.players, raffle.winner, raffle.balance);
    }

    function getContractBalance() external view returns(uint256) {
        return address(this).balance;
    }
}

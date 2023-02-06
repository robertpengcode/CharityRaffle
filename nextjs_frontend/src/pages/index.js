import { contractAddresses, abi } from "../../constants";
import { useMoralis, useWeb3Contract } from "react-moralis";
import { useState } from "react";
import { ethers } from "ethers";

const Home = () => {
  const { Moralis, isWeb3Enabled, chainId: chainIdHex } = useMoralis();
  const { runContractFunction } = useWeb3Contract();
  const chainId = parseInt(chainIdHex);
  //console.log(`ChainId is ${chainId}`);
  const charityRaffleAddress =
    chainId in contractAddresses ? contractAddresses[chainId][0] : null;

  const [charityAddr, setCharityAddr] = useState("");
  const [description, setDescription] = useState("");
  const [endTime, setEndTime] = useState(0);
  const [raffleStatus, setRaffleStatus] = useState("");
  const [players, setPlayers] = useState([]);
  const [winner, setWinner] = useState("");
  const [balance, setBalance] = useState(0);

  async function handleGetRaffleInfo() {
    //console.log("run get...");
    const getInfoObject = {
      abi: abi,
      contractAddress: charityRaffleAddress,
      functionName: "getRaffleInfo",
      params: {},
    };
    const result = await runContractFunction({
      params: getInfoObject,
      onError: (error) => {
        console.log(error);
      },
    });
    setInfo(result);
  }

  const setInfo = (info) => {
    setCharityAddr(info[0]);
    setDescription(info[1]);
    setEndTime(info[2].toNumber());
    setRaffleStatus(info[3]);
    setPlayers(info[4]);
    setWinner(info[5]);
    setBalance(info[6].toNumber());
  };

  const convertStatus = (status) => {
    if (status === 0) {
      return "OPEN";
    } else if (status === 1) {
      return "CALCULATING";
    } else if (status === 2) {
      return "END";
    } else if (status === 3) {
      return "PAID";
    }
  };

  const convertAddress = (addr) => {
    return addr.slice(0, 4) + "..." + addr.slice(addr.length - 4);
  };

  return (
    <div>
      <h1 className="mt-4 ml-4 font-bold text-2xl text-sky-700">Raffle Info</h1>
      <button
        className="bg-sky-700 hover:bg-sky-500 text-white font-bold py-2 px-4 rounded ml-4 mt-4"
        onClick={handleGetRaffleInfo}
      >
        Get Info
      </button>

      <div className="mt-4 ml-4">
        <div>Charity Address: {charityAddr}</div>
      </div>
      <div className="mt-2 ml-4">
        <div>Description: {description} </div>
      </div>
      <div className="mt-2 ml-4">
        <div>
          End Time:{" "}
          {endTime === 0 ? null : new Date(endTime * 1000).toLocaleString()}
        </div>
      </div>
      <div className="mt-2 ml-4">
        <div>Status: {convertStatus(raffleStatus)} </div>
      </div>
      <div className="mt-2 ml-4">
        <div>
          Players({players.length}){": "}
          {players.length === 0
            ? null
            : players.map((player) => `${convertAddress(player)}, `)}
        </div>
      </div>
      <div className="mt-2 ml-4">
        <div>
          Winner: {winner.slice(0, 4) === "0x00" ? "None" : winner.slice(0, 4)}{" "}
        </div>
      </div>
      <div className="mt-2 ml-4">
        <div>
          Balance (Ether):{" "}
          {balance === 0 ? null : ethers.utils.formatEther(balance)}
        </div>
      </div>
    </div>
  );
};

export default Home;

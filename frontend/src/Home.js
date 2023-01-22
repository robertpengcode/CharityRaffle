import { useState } from "react";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import { ethers } from "ethers";

const Home = ({ contract }) => {
  const [charityAddr, setCharityAddr] = useState("");
  const [description, setDescription] = useState("");
  const [endTime, setEndTime] = useState(0);
  const [raffleStatus, setRaffleStatus] = useState("");
  const [players, setPlayers] = useState([]);
  const [winner, setWinner] = useState("");
  const [balance, setBalance] = useState(0);

  const getRaffleInfo = async () => {
    if (!contract) {
      alert("Please connect to MetaMask!");
      return;
    }
    await contract
      .getRaffleInfo()
      .then((info) => {
        setInfo(info);
      })
      .catch((err) => {
        alert(err.message);
      });
  };

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
    <Container>
      <h1 className="display-6 d-flex justify-content-center">
        Raffle Information
      </h1>
      <Button
        variant="outline-success"
        className="mt-2"
        onClick={getRaffleInfo}
      >
        Get Info
      </Button>
      <Container>
        <div className="mt-2">
          <div>Charity Address: {charityAddr}</div>
        </div>
        <div className="mt-2">
          <div>Description: {description} </div>
        </div>
        <div className="mt-2">
          <div>
            End Time:{" "}
            {endTime === 0 ? null : new Date(endTime * 1000).toLocaleString()}
          </div>
        </div>
        <div className="mt-2">
          <div>Status: {convertStatus(raffleStatus)} </div>
        </div>
        <div className="mt-2">
          <div>
            Players({players.length}){": "}
            {players.length === 0
              ? null
              : players.map((player) => `${convertAddress(player)}, `)}
          </div>
        </div>
        <div className="mt-2">
          <div>
            Winner:{" "}
            {winner.slice(0, 4) === "0x00" ? "None" : winner.slice(0, 4)}{" "}
          </div>
        </div>
        <div className="mt-2">
          <div>
            Balance (Ether):{" "}
            {balance === 0 ? null : ethers.utils.formatEther(balance)}
          </div>
        </div>
      </Container>
    </Container>
  );
};
// {ethers.utils.formatEther(balance)}
export default Home;

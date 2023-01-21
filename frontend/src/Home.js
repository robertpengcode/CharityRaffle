import { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";

const Home = ({ contract }) => {
  const [charityAddr, setCharityAddr] = useState("");
  const [description, setDescription] = useState("");
  const [endTime, setEndTime] = useState(0);
  const [raffleStatus, setRaffleStatus] = useState("");
  const [players, setPlayers] = useState([]);
  const [winner, setWinner] = useState("");
  const [balance, setBalance] = useState("");

  //console.log("ck", players);

  const getRaffleInfo = async () => {
    if (!contract) {
      alert("Please connect to MetaMask!");
      return;
    }
    await contract
      .getRaffleInfo()
      .then((info) => {
        //console.log(info);
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
      <Button variant="outline-success" onClick={getRaffleInfo}>
        Get Info
      </Button>
      <Container>
        <div>
          <div>Charity Address: {charityAddr}</div>
        </div>
        <div>
          <div>Description: {description} </div>
        </div>
        <div>
          <div>
            End Time:{" "}
            {endTime === 0 ? null : new Date(endTime * 1000).toLocaleString()}
          </div>
        </div>
        <div>
          <div>Status: {convertStatus(raffleStatus)} </div>
        </div>
        <div>
          <div>
            Players({players.length}){": "}
            {players.length === 0
              ? null
              : players.map((player) => `${convertAddress(player)}, `)}
          </div>
        </div>
        <div>
          <div>
            Winner:{" "}
            {winner.slice(0, 4) === "0x00" ? "None" : winner.slice(0, 4)}{" "}
          </div>
        </div>
        <div>
          <div>Balance: {balance} </div>
        </div>
      </Container>
    </Container>
  );
};
export default Home;

import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import { ethers } from "ethers";

const BuyerMenu = ({ contract, ticketPrice }) => {
  //console.log("ck2", ticketPrice);
  const buyRaffle = async () => {
    if (!contract) {
      alert("Please connect to MetaMask!");
      return;
    }
    await contract
      .buyRaffle({ value: ticketPrice })
      .then(() => alert("buy raffle success!"))
      .catch((err) => {
        console.log("e", err);
        alert(err.message);
      });
  };

  const pay = async () => {
    if (!contract) {
      alert("Please connect to MetaMask!");
      return;
    }
    await contract
      .makePayments()
      .then(() => alert("pay charity & winner success!"))
      .catch((err) => {
        alert(err.message);
      });
  };

  return (
    <Container className="d-flex flex-column align-items-center">
      <h1 className="display-6 d-flex justify-content-center">Buyer's Menu</h1>

      <div className="mt-4">
        Ticket Price (Ether):{" "}
        {ticketPrice === 0 ? null : ethers.utils.formatEther(ticketPrice)}
      </div>

      <Button variant="outline-success" className="mt-4" onClick={buyRaffle}>
        Buy Raffle
      </Button>

      <Button variant="outline-success" className="mt-4" onClick={pay}>
        Pay Charity & Winner
      </Button>
    </Container>
  );
};

export default BuyerMenu;

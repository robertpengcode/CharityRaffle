import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
//import { ethers } from "ethers";

const BuyerMenu = ({ contract }) => {
  const buyRaffle = async () => {
    if (!contract) {
      alert("Please connect to MetaMask!");
      return;
    }
    //const ticketPrice = ethers.utils.parseEther("0.001");
    // const ticketPrice = (await contract.ticketPrice()).toNumber();
    //console.log("t", ticketPrice);
    await contract
      .buyRaffle({ value: 100 })
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

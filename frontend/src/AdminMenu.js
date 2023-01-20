import { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";

const AdminMenu = ({ contract }) => {
  const [charityAddr, setCharityAddr] = useState("");
  const [description, setDescription] = useState("");
  const [intervalHrs, setIntervalHrs] = useState("");

  const createRaffle = async () => {
    if (!contract) {
      alert("Please connect to MetaMask!");
      return;
    }
    await contract
      .createRaffle(charityAddr, description, intervalHrs * 3600)
      .then(() => alert("create raffle success!"))
      .catch((err) => {
        alert(err.message);
      });
    setCharityAddr("");
    setDescription("");
    setIntervalHrs("");
  };

  const withdraw = async () => {
    if (!contract) {
      alert("Please connect to MetaMask!");
      return;
    }
    await contract
      .createRaffle()
      .then(() => alert("create raffle success!"))
      .catch((err) => {
        alert(err.message);
      });
    // setCharityAddr("");
    // setDescription("");
    // setIntervalHrs("");
  };

  return (
    <Container>
      <h1 className="display-6 d-flex justify-content-center">Admin's Menu</h1>
      <Form>
        <Form.Group className="mb-3">
          <Form.Label>Charity Address</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Charity Address"
            value={charityAddr}
            onChange={(e) => {
              setCharityAddr(e.target.value);
            }}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Description"
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
            }}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Hours</Form.Label>
          <Form.Control
            type="number"
            placeholder="Enter Hours"
            value={intervalHrs}
            onChange={(e) => {
              setIntervalHrs(e.target.value);
            }}
            min="0"
            max="24"
          />
        </Form.Group>

        <Button variant="outline-success" onClick={createRaffle}>
          Create Raffle
        </Button>
      </Form>

      <Button variant="outline-success" onClick={withdraw}>
        Owner Withdraw
      </Button>
    </Container>
  );
};

export default AdminMenu;

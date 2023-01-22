import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home";
import NavbarTop from "./NavbarTop";
import AdminMenu from "./AdminMenu";
import BuyerMenu from "./BuyerMenu";
import { connect, getContract } from "./contract";
import { useState, useEffect } from "react";

function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [contract, setContract] = useState(null);
  const [signerAddr, setSignerAddr] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [ticketPrice, setTicketPrice] = useState(0);

  useEffect(() => {
    window.ethereum.request({ method: "eth_accounts" }).then((accounts) => {
      if (accounts.length > 0) {
        setIsConnected(true);
        getContract().then(async ({ contract, signer }) => {
          setContract(contract);
          if (contract) {
            checkAdmin(contract, signer);
            const price = await contract.ticketPrice();
            //console.log("here", price);
            setTicketPrice(price);
          }
        });
      } else {
        setIsConnected(false);
      }
    });
  }, []);

  const checkAdmin = (contract, signer) => {
    signer.getAddress().then((address) => {
      setSignerAddr(address);
      contract
        .getAdmin()
        .then((admin) => {
          return admin === address;
        })
        .then((result) => {
          setIsAdmin(result);
        });
    });
  };

  const connectMetaMask = async () => {
    const { contract } = await connect();
    if (contract) {
      setContract(contract);
      setIsConnected(true);
      alert("Connect!");
    }
  };

  return (
    <div className="App">
      <Router>
        <NavbarTop
          connectMetaMask={connectMetaMask}
          isConnected={isConnected}
          isAdmin={isAdmin}
          signerAddr={signerAddr}
        />
        <div className="container">
          <Routes>
            <Route path="" element={<Home contract={contract} />} />
            {isAdmin ? (
              <Route path="admin" element={<AdminMenu contract={contract} />} />
            ) : (
              <Route path="admin" element={<></>} />
            )}
            <Route
              path="buyer"
              element={
                <BuyerMenu contract={contract} ticketPrice={ticketPrice} />
              }
            />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;

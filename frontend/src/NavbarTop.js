import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";

const NavbarTop = ({ connectMetaMask, isConnected, isAdmin }) => {
  return (
    <Navbar bg="info" expand="sm" variant="dark">
      <Container>
        <Navbar.Brand href="/">Charity Raffle</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {isAdmin ? <Nav.Link href="admin">Admin</Nav.Link> : null}
            <Nav.Link href="buyer">Buyer</Nav.Link>
          </Nav>
          <Nav>
            {isConnected ? (
              <Navbar.Text>connected</Navbar.Text>
            ) : (
              <Button variant="outline-success" onClick={connectMetaMask}>
                Connect
              </Button>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavbarTop;

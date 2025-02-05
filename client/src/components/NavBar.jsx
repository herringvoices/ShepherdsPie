import { NavLink } from "react-router-dom";
import { Button, Navbar, Nav } from "react-bootstrap";
import { logout } from "../managers/authManager";

export default function NavBar({ loggedInUser, setLoggedInUser }) {
  return (
    <Navbar bg="light" expand="lg" fixed="top">
      <Navbar.Brand as={NavLink} to="/" className="mx-5">
        Brand
      </Navbar.Brand>
      <Nav activeKey={"/orders"}>
        <Nav.Item>
          <Nav.Link href="/orders">Orders</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link href="/orders/create">Create Order</Nav.Link>
        </Nav.Item>

        <Nav.Item>
          <Nav.Link href="/employees">Employees</Nav.Link>
        </Nav.Item>
      </Nav>
      <Nav className="ms-auto mx-5">
        {loggedInUser ? (
          <Button
            variant="outline-danger"
            onClick={() => logout().then(() => setLoggedInUser(null))}
          >
            Logout
          </Button>
        ) : (
          <Nav.Link as={NavLink} to="/login">
            <Button variant="outline-primary">Login</Button>
          </Nav.Link>
        )}
      </Nav>
    </Navbar>
  );
}

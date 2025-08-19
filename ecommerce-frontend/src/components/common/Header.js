import React from 'react';
import { Navbar, Nav, Container, Badge, Button, NavDropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaUser } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { logout } from '../../api/auth';

const Header = () => {
  const { currentUser, setCurrentUser, isAuthenticated, isAdmin } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      setCurrentUser(null);
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
      <Container>
        <Navbar.Brand as={Link} to="/">E-Commerce Store</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            <Nav.Link as={Link} to="/products">Products</Nav.Link>
            {isAdmin && (
              <NavDropdown title="Admin" id="admin-nav-dropdown">
                <NavDropdown.Item as={Link} to="/admin/dashboard">Dashboard</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/admin/products">Manage Products</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/admin/orders">Manage Orders</NavDropdown.Item>
              </NavDropdown>
            )}
          </Nav>
          <Nav>
            {isAuthenticated ? (
              <>
                <Nav.Link as={Link} to="/cart">
                  <FaShoppingCart /> Cart
                  {itemCount > 0 && (
                    <Badge pill bg="danger" className="ms-1">
                      {itemCount}
                    </Badge>
                  )}
                </Nav.Link>
                <NavDropdown title={<><FaUser /> {currentUser?.name}</>} id="user-nav-dropdown">
                  <NavDropdown.Item as={Link} to="/orders">My Orders</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/profile">Profile</NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
                </NavDropdown>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login">Login</Nav.Link>
                <Nav.Link as={Link} to="/register">Register</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
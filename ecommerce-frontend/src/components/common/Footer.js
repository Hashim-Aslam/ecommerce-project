import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const Footer = () => {
  return (
    <footer className="bg-dark text-light py-4 mt-5">
      <Container>
        <Row>
          <Col md={4} className="mb-4 mb-md-0">
            <h5>E-Commerce Store</h5>
            <p>Your one-stop shop for all your needs.</p>
          </Col>
          <Col md={4} className="mb-4 mb-md-0">
            <h5>Quick Links</h5>
            <ul className="list-unstyled">
              <li><a href="/" className="text-light">Home</a></li>
              <li><a href="/products" className="text-light">Products</a></li>
              <li><a href="/cart" className="text-light">Cart</a></li>
              <li><a href="/orders" className="text-light">Orders</a></li>
            </ul>
          </Col>
          <Col md={4}>
            <h5>Contact Us</h5>
            <address className="text-light">
              123 Shopping Avenue<br />
              Commerce City, ST 12345<br />
              <abbr title="Phone">P:</abbr> (123) 456-7890
            </address>
            <p>Email: <a href="mailto:info@ecommerce.com" className="text-light">info@ecommerce.com</a></p>
          </Col>
        </Row>
        <hr className="my-3" />
        <Row>
          <Col className="text-center">
            <p className="mb-0">&copy; {new Date().getFullYear()} E-Commerce Store. All rights reserved.</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
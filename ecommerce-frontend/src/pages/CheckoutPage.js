import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import CheckoutForm from '../components/checkout/CheckoutForm';
import OrderSummary from '../components/checkout/OrderSummary';
import { useCart } from '../context/CartContext';
import { Navigate } from 'react-router-dom';

const CheckoutPage = () => {
  const { cart, loading } = useCart();
  
  // Redirect if cart is empty
  if (!loading && (!cart.items || cart.items.length === 0)) {
    return <Navigate to="/cart" replace />;
  }
  
  return (
    <Container className="my-5">
      <h1 className="mb-4">Checkout</h1>
      
      <Row>
        <Col lg={8} className="mb-4">
          <Card>
            <Card.Body>
              <CheckoutForm />
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg={4}>
          <OrderSummary items={cart.items || []} />
        </Col>
      </Row>
    </Container>
  );
};

export default CheckoutPage;
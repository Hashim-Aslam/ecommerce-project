import React from 'react';
import { Card, ListGroup } from 'react-bootstrap';

const OrderSummary = ({ items }) => {
  // Calculate totals
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 0 ? 5.99 : 0; // Free shipping above certain threshold could be implemented
  const total = subtotal + shipping;

  return (
    <Card className="sticky-top" style={{ top: '1rem' }}>
      <Card.Header as="h5">Order Summary</Card.Header>
      <ListGroup variant="flush">
        <ListGroup.Item>
          <div className="d-flex justify-content-between">
            <span>Items ({items.reduce((count, item) => count + item.quantity, 0)})</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
        </ListGroup.Item>
        <ListGroup.Item>
          <div className="d-flex justify-content-between">
            <span>Shipping</span>
            <span>${shipping.toFixed(2)}</span>
          </div>
        </ListGroup.Item>
        <ListGroup.Item>
          <div className="d-flex justify-content-between fw-bold">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </ListGroup.Item>
      </ListGroup>
    </Card>
  );
};

export default OrderSummary;
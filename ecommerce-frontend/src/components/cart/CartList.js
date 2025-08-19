import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Card, Alert, Spinner } from 'react-bootstrap';
import { FaShoppingBasket, FaTrash } from 'react-icons/fa';
import CartItem from './CartItem';
import CartSummary from './CartSummary';
import { useCart } from '../../context/CartContext';

const CartList = () => {
  const { cart, loading, error, removeItem, clearAllItems } = useCart();
  const navigate = useNavigate();

  const handleRemoveItem = async (productId) => {
    await removeItem(productId);
  };

  const handleClearCart = async () => {
    await clearAllItems();
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (loading) {
    return (
      <Container className="text-center my-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="my-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <h1 className="mb-4">Your Shopping Cart</h1>
      
      {(!cart.items || cart.items.length === 0) ? (
        <Card className="text-center p-5">
          <Card.Body>
            <FaShoppingBasket size={50} className="text-muted mb-3" />
            <Card.Title>Your cart is empty</Card.Title>
            <Card.Text>
              Looks like you haven't added any products to your cart yet.
            </Card.Text>
            <Button variant="primary" onClick={() => navigate('/products')}>
              Continue Shopping
            </Button>
          </Card.Body>
        </Card>
      ) : (
        <Row>
          <Col lg={8} className="mb-4">
            <Card>
              <Card.Header className="d-flex justify-content-between align-items-center">
                <span>Cart Items ({cart.items.length})</span>
                <Button 
                  variant="outline-danger" 
                  size="sm"
                  onClick={handleClearCart}
                >
                  <FaTrash className="me-2" />
                  Clear Cart
                </Button>
              </Card.Header>
              <Card.Body>
                {cart.items.map(item => (
                  <CartItem 
                    key={item.product_id} 
                    item={item} 
                    onRemove={handleRemoveItem} 
                  />
                ))}
              </Card.Body>
            </Card>
          </Col>
          
          <Col lg={4}>
            <CartSummary 
              items={cart.items} 
              onCheckout={handleCheckout} 
            />
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default CartList;
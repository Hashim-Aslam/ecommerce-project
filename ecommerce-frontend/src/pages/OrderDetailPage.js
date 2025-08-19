import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Row, Col, Card, Table, Badge, Button, Alert, Spinner } from 'react-bootstrap';
import { FaArrowLeft } from 'react-icons/fa';
import { getOrderById } from '../api/orders';

const OrderDetailPage = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        const data = await getOrderById(orderId);
        setOrder(data);
      } catch (err) {
        setError(err.message || 'Failed to fetch order details');
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId]);

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'processing': return 'info';
      case 'shipped': return 'primary';
      case 'delivered': return 'success';
      case 'cancelled': return 'danger';
      default: return 'secondary';
    }
  };

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
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
        <Button as={Link} to="/orders" variant="outline-primary">
          <FaArrowLeft /> Back to Orders
        </Button>
      </Container>
    );
  }

  if (!order) {
    return (
      <Container className="my-5">
        <Alert variant="warning">Order not found</Alert>
        <Button as={Link} to="/orders" variant="outline-primary">
          <FaArrowLeft /> Back to Orders
        </Button>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <Button as={Link} to="/orders" variant="outline-primary" className="mb-4">
        <FaArrowLeft /> Back to Orders
      </Button>
      
      <h1 className="mb-4">Order Details</h1>
      
      <Row>
        <Col lg={8} className="mb-4">
          <Card className="mb-4">
            <Card.Header>
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Order #{order._id.substring(0, 8)}</h5>
                <Badge bg={getStatusBadgeVariant(order.status)}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </Badge>
              </div>
            </Card.Header>
            <Card.Body>
              <Row className="mb-3">
                <Col md={6}>
                  <p className="mb-1"><strong>Order Date:</strong></p>
                  <p>{formatDate(order.created_at)}</p>
                </Col>
                <Col md={6}>
                  <p className="mb-1"><strong>Last Updated:</strong></p>
                  <p>{formatDate(order.updated_at)}</p>
                </Col>
              </Row>
              <hr />
              <h5>Items</h5>
              <Table responsive>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {console.log("order",order)}
                  {order.items.map((item) => (
                    <tr key={item.product_id}>
                      <td>{item.name}</td>
                      <td>${item.price.toFixed(2)}</td>
                      <td>{item.quantity}</td>
                      <td>${(item.price * item.quantity).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg={4}>
          <Card className="mb-4">
            <Card.Header>
              <h5 className="mb-0">Order Summary</h5>
            </Card.Header>
            <Card.Body>
              <div className="d-flex justify-content-between mb-3">
                <span>Subtotal:</span>
                <span>${order.total.toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between mb-3">
                <span>Shipping:</span>
                <span>$0.00</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between fw-bold">
                <span>Total:</span>
                <span>${order.total.toFixed(2)}</span>
              </div>
            </Card.Body>
          </Card>
          
          <Card>
            <Card.Header>
              <h5 className="mb-0">Shipping Address</h5>
            </Card.Header>
            <Card.Body>
              <address>
                {order.shipping_address.address_line1}<br />
                {order.shipping_address.address_line2 && (
                  <>{order.shipping_address.address_line2}<br /></>
                )}
                {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.postal_code}<br />
                {order.shipping_address.country}
              </address>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default OrderDetailPage;
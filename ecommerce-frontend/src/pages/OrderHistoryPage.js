import React, { useState, useEffect } from 'react';
import { Container, Table, Badge, Alert, Spinner, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { getOrders } from '../api/orders';

const OrderHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const data = await getOrders();
        setOrders(data);
      } catch (err) {
        setError(err.message || 'Failed to fetch orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

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
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <Container className="my-5">
      <h1 className="mb-4">Order History</h1>
      
      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : orders.length === 0 ? (
        <Alert variant="info">
          You haven't placed any orders yet.
          <div className="mt-3">
            <Button as={Link} to="/products" variant="primary">
              Start Shopping
            </Button>
          </div>
        </Alert>
      ) : (
        <Table responsive striped hover>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Date</th>
              <th>Total</th>
              <th>Status</th>
              <th>Items</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order._id.substring(0, 8)}...</td>
                <td>{formatDate(order.created_at)}</td>
                <td>${order.total.toFixed(2)}</td>
                <td>
                  <Badge bg={getStatusBadgeVariant(order.status)}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </Badge>
                </td>
                <td>{order.items.reduce((sum, item) => sum + item.quantity, 0)} items</td>
                <td>
                  <Button 
                    as={Link} 
                    to={`/orders/${order._id}`} 
                    variant="outline-primary" 
                    size="sm"
                  >
                    View Details
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default OrderHistoryPage;
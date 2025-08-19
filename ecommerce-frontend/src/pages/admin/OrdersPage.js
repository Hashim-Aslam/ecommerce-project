import React, { useState, useEffect } from 'react';
import { Container, Table, Badge, Alert, Spinner, Row, Col, Form, Button, Modal } from 'react-bootstrap';
import { FaSearch, FaEdit } from 'react-icons/fa';
import { getAllOrders, updateOrderStatus } from '../../api/admin';
import { toast } from 'react-toastify';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  
  useEffect(() => {
    fetchOrders();
  }, []);
  
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await getAllOrders();
      setOrders(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const openStatusModal = (order) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setShowStatusModal(true);
  };

  const handleStatusUpdate = async () => {
    try {
      await updateOrderStatus(selectedOrder._id, { status: newStatus });
      
      // Update the order in the state
      setOrders(orders.map(order => 
        order._id === selectedOrder._id ? { ...order, status: newStatus } : order
      ));
      
      toast.success(`Order status updated to ${newStatus}`);
      setShowStatusModal(false);
    } catch (err) {
      toast.error(`Failed to update status: ${err.message}`);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

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

  // Apply filters
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.user_id && order.user_id.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = filterStatus ? order.status === filterStatus : true;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <Container className="my-5">
      <h1 className="mb-4">Order Management</h1>
      
      <Row className="mb-4">
        <Col md={6}>
          <Form.Group className="d-flex">
            <Form.Control
              type="text"
              placeholder="Search by order ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button variant="outline-secondary">
              <FaSearch />
            </Button>
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>
      
      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : filteredOrders.length === 0 ? (
        <Alert variant="info">
          No orders found matching your criteria.
        </Alert>
      ) : (
        <Table responsive striped hover>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Date</th>
              <th>Customer ID</th>
              <th>Items</th>
              <th>Total</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map(order => (
              <tr key={order._id}>
                <td>{order._id.substring(0, 8)}...</td>
                <td>{formatDate(order.created_at)}</td>
                <td>{order.user_id.substring(0, 8)}...</td>
                <td>{order.items.reduce((sum, item) => sum + item.quantity, 0)} items</td>
                <td>${order.total.toFixed(2)}</td>
                <td>
                  <Badge bg={getStatusBadgeVariant(order.status)}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </Badge>
                </td>
                <td>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={() => openStatusModal(order)}
                  >
                    <FaEdit /> Update Status
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
      
      {/* Status Update Modal */}
      <Modal show={showStatusModal} onHide={() => setShowStatusModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Update Order Status</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Order ID: {selectedOrder?._id}</p>
          <Form.Group>
            <Form.Label>Status</Form.Label>
            <Form.Select 
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
            >
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </Form.Select>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowStatusModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleStatusUpdate}>
            Update Status
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default OrdersPage;